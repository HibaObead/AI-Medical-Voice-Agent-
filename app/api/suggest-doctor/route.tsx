import { NextRequest, NextResponse } from "next/server";
import { openai } from "@/config/OpenAiModle";
import { AIDoctorAgents } from "@/shared/list";

export async function POST(req: NextRequest) {
    const { notes } = await req.json();

    // Check if API key is configured
    if (!process.env.OPEN_ROUTER_API_KEY) {
        console.log("⚠️ API key not configured, returning fallback doctors");
        // Return fallback doctors if API key is not configured
        return NextResponse.json(AIDoctorAgents.slice(0, 3));
    }

    try {
        const completion = await openai.chat.completions.create({
            model: 'google/gemini-2.5-flash',
            messages: [
                {
                    role: 'system',
                    content: JSON.stringify(AIDoctorAgents)
                },
                {
                    role: 'user',
                    content: 'User Notes/Symptoms: ' + notes + "Depends on user notes and symptoms, Please suggest a list of doctors, Return Object in JSON only "
                },
            ],
        });
        const rawResp = completion.choices[0].message || '';
        // @ts-ignore
        const Resp = rawResp.content.trim().replace('```json', '').replace('```', '');
        const JSONResp = JSON.parse(Resp);

        // Validate and sanitize the response to ensure proper image and specialist properties
        const sanitizedResponse = Array.isArray(JSONResp) ? JSONResp.map(doctor => ({
            ...doctor,
            image: doctor.image && doctor.image.trim() !== '' ? doctor.image : '/doctor1.png',
            specialist: doctor.specialist && doctor.specialist.trim() !== '' ? doctor.specialist : 'Medical Specialist',
            description: doctor.description && doctor.description.trim() !== '' ? doctor.description : 'Professional medical consultation',
            id: doctor.id || Math.floor(Math.random() * 1000),
            agentPrompt: doctor.agentPrompt || 'You are a helpful medical AI assistant.'
        })) : [{
            ...JSONResp,
            image: JSONResp.image && JSONResp.image.trim() !== '' ? JSONResp.image : '/doctor1.png',
            specialist: JSONResp.specialist && JSONResp.specialist.trim() !== '' ? JSONResp.specialist : 'Medical Specialist',
            description: JSONResp.description && JSONResp.description.trim() !== '' ? JSONResp.description : 'Professional medical consultation',
            id: JSONResp.id || Math.floor(Math.random() * 1000),
            agentPrompt: JSONResp.agentPrompt || 'You are a helpful medical AI assistant.'
        }];

        return NextResponse.json(sanitizedResponse);
    }
    catch (e: any) {
        console.error("API Error:", e);

        // Handle specific error types
        if (e.status === 401) {
            console.log("⚠️ Authentication failed, returning fallback doctors");
            return NextResponse.json(AIDoctorAgents.slice(0, 3));
        }

        if (e.status === 429) {
            console.log("⚠️ Rate limit exceeded, returning fallback doctors");
            return NextResponse.json(AIDoctorAgents.slice(0, 3));
        }

        console.log("⚠️ API error occurred, returning fallback doctors");
        return NextResponse.json(AIDoctorAgents.slice(0, 3));
    }
}




