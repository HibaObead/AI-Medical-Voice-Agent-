import { db } from "@/config/db";
import { currentUser } from "@clerk/nextjs/server";
import { SessionChatTable } from "@/config/schema";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { eq } from "drizzle-orm";

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
        return NextResponse.json(result[0]);
    } catch (e) {
        return NextResponse.json({ error: String(e) }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("sessionId");
    if (!sessionId) {
        return NextResponse.json({ error: "Missing sessionId" }, { status: 400 });
    }
    try {
        const result = await db
            .select()
            .from(SessionChatTable)
            .where(eq(SessionChatTable.sessionId, sessionId));
        if (!result || result.length === 0) {
            return NextResponse.json({ error: "Session not found" }, { status: 404 });
        }
        return NextResponse.json(result[0]);
    } catch (e) {
        return NextResponse.json({ error: String(e) }, { status: 500 });
    }
}