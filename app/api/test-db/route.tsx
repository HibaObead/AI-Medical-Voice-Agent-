import { db } from "@/config/db";
import { SessionChatTable } from "@/config/schema";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        // Test database connection by fetching all sessions
        const sessions = await db.select().from(SessionChatTable);
        return NextResponse.json({
            success: true,
            sessionCount: sessions.length,
            sessions: sessions
        });
    } catch (error) {
        console.error('Database error:', error);
        return NextResponse.json({
            success: false,
            error: String(error)
        }, { status: 500 });
    }
}

