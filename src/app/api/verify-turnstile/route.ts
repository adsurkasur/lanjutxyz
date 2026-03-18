import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { token } = await request.json() as { token: string };

  if (!token) {
    return NextResponse.json({ success: false, error: "No token provided" }, { status: 400 });
  }

  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    // If secret not configured, skip verification (dev mode)
    return NextResponse.json({ success: true });
  }

  const formData = new FormData();
  formData.append("secret", secret);
  formData.append("response", token);

  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    body: formData,
  });

  const data = await res.json() as { success: boolean };

  if (!data.success) {
    return NextResponse.json({ success: false, error: "Captcha verification failed" }, { status: 403 });
  }

  return NextResponse.json({ success: true });
}
