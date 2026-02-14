import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { email, firstName } = await req.json();

    const { data, error } = await resend.emails.send({
      from: "Hebrew Master <onboarding@resend.dev>",
      to: [email],
      subject: "Welcome to The Jerusalem Bridge ",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #001B4D;">Welcome to The Jerusalem Bridge, ${firstName}!</h1>
          <p>You have successfully created your student account.</p>
          <p>Please confirm your email to access your dashboard and start learning.</p>
          <div style="margin-top: 30px; padding: 20px; background-color: #FAFAF8; border: 1px solid #e5e2db;">
            <p style="font-size: 14px; color: #6b7280;">If you did not sign up for this account, please ignore this email.</p>
          </div>
        </div>
      `,
    });

    if (error) {
      return NextResponse.json({ error }, { status: 400 });
    }

    return NextResponse.json({ data });
  } catch (err) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}