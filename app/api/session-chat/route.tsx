import { db } from "@/config/db";
import { currentUser } from "@clerk/nextjs/server";
import { SessionChatTable } from "@/config/schema";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { desc, eq } from "drizzle-orm";
import { openai } from "@/config/OpenAiModle";

const AUTO_REPORT_PROMPT = `You are an AI Medical Assistant. Based on the patient's notes and the selected doctor's specialty, generate a medical report.

Patient Notes: {notes}
Selected Doctor: {doctorSpecialist}
Doctor Description: {doctorDescription}

Generate a medical report with the following structure:
1. sessionId: the provided session ID
2. agent: the medical specialist name
3. user: "Patient" or "Anonymous"
4. timestamp: current date and time in ISO format
5. chiefComplaint: one-sentence summary of the main health concern based on notes
6. summary: a 2-3 sentence summary of the patient's condition and initial assessment
7. symptoms: list of symptoms mentioned in the notes
8. duration: estimate based on notes or "Not specified"
9. severity: mild, moderate, or severe based on symptoms described
10. medicationsMentioned: list of any medicines mentioned in notes
11. recommendations: list of AI suggestions based on the doctor's specialty and symptoms

Return the result in this JSON format:
{
  "sessionId": "string",
  "agent": "string",
  "user": "string",
  "timestamp": "ISO Date string",
  "chiefComplaint": "string",
  "summary": "string",
  "symptoms": ["symptom1", "symptom2"],
  "duration": "string",
  "severity": "string",
  "medicationsMentioned": ["med1", "med2"],
  "recommendations": ["rec1", "rec2"],
}
Only include valid fields. Respond with nothing else.
`

export async function POST(req: NextRequest) {
    const { notes, selectedDoctor } = await req.json();
    const user = await currentUser();
    try {
        const sessionId = uuidv4();
        const result = await db
            .insert(SessionChatTable)
            .values({
                sessionId: sessionId,
                createdBy: user?.primaryEmailAddress?.emailAddress ?? null,
                notes: notes,
                selectedDoctor: selectedDoctor,
                createdOn: new Date().toISOString(),
            })
            .returning({
                sessionId: SessionChatTable.sessionId,
                createdBy: SessionChatTable.createdBy,
                createdOn: SessionChatTable.createdOn,
                notes: SessionChatTable.notes,
                selectedDoctor: SessionChatTable.selectedDoctor,
            });

        // Automatically generate a report
        try {
            const reportPrompt = AUTO_REPORT_PROMPT
                .replace('{notes}', notes || 'No notes provided')
                .replace('{doctorSpecialist}', selectedDoctor.specialist)
                .replace('{doctorDescription}', selectedDoctor.description);

            const completion = await openai.chat.completions.create({
                model: 'google/gemini-2.5-flash',
                messages: [
                    {
                        role: 'system', content: reportPrompt
                    },
                    {
                        role: 'user', content: `Generate a report for session: ${sessionId}`
                    }
                ],
            });

            const rawResp = completion.choices[0].message || '';
            const Resp = (rawResp.content || '').trim().replace('```json', '').replace('```', '');
            const JSONResp = JSON.parse(Resp);

            // Add sessionId to the report if not present
            if (!JSONResp.sessionId) {
                JSONResp.sessionId = sessionId;
            }

            // Update the session with the generated report
            await db.update(SessionChatTable).set({
                report: JSONResp,
            }).where(eq(SessionChatTable.sessionId, sessionId));

            // Return the session with the report
            const updatedResult = await db
                .select()
                .from(SessionChatTable)
                .where(eq(SessionChatTable.sessionId, sessionId));

            return NextResponse.json(updatedResult[0]);
        } catch (reportError) {
            console.error('Error generating report:', reportError);
            // Return the session even if report generation fails
            return NextResponse.json(result[0]);
        }
    } catch (e) {
        return NextResponse.json({ error: String(e) }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("sessionId");
    const user = await currentUser();

    if (!sessionId) {
        return NextResponse.json({ error: "Missing sessionId" }, { status: 400 });
    }

    try {
        if (sessionId === "all") {
            const result = await db
                .select().from(SessionChatTable)
                //@ts-ignore
                .where(eq(SessionChatTable.createdBy, user?.primaryEmailAddress?.emailAddress ?? null)).orderBy(desc(SessionChatTable.id));
            return NextResponse.json(result);
        }
        else {
            const result = await db
                .select().from(SessionChatTable)
                //@ts-ignore
                .where(eq(SessionChatTable.sessionId, sessionId));
            return NextResponse.json(result[0]);
        }
    } catch (e) {
        return NextResponse.json({ error: String(e) }, { status: 500 });
    }
}

