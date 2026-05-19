import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(request) {
  try {
    const { message } = await request.json();

    if (!message || typeof message !== "string" || !message.trim()) {
      return NextResponse.json(
        { error: "A guestbook message is required." },
        { status: 400 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json(
        { error: "Guestbook is not configured." },
        { status: 500 }
      );
    }

    const forwardedFor = request.headers.get("x-forwarded-for");
    const ip = forwardedFor?.split(",")[0]?.trim() ?? null;
    const userAgent = request.headers.get("user-agent");

    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false }
    });

    const { data, error } = await supabase
      .from("guestbook")
      .insert({
        author: "guest@visitor",
        message: message.trim(),
        user_agent: userAgent,
        ip
      })
      .select("id, author, message, created_at")
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({ ok: true, entry: data });
  } catch (error) {
    return NextResponse.json(
      { error: error.message ?? "Unable to post wall message." },
      { status: 500 }
    );
  }
}
