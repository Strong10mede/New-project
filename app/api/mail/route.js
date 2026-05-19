import { NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(request) {
  try {
    const { message } = await request.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message is required." }, { status: 400 });
    }

    if (!process.env.RESEND_API_KEY || !process.env.MAYUR_EMAIL) {
      return NextResponse.json(
        { error: "Mail service is not configured." },
        { status: 500 }
      );
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    await resend.emails.send({
      from: process.env.MAIL_FROM ?? "Mayur Portfolio <onboarding@resend.dev>",
      to: process.env.MAYUR_EMAIL,
      subject: "New portfolio terminal message",
      text: message
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: error.message ?? "Unable to send message." },
      { status: 500 }
    );
  }
}
