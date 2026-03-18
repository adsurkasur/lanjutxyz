import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type");

  if (token_hash && type) {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
    );

    const { error } = await supabase.auth.verifyOtp({
      type: type as "email" | "signup" | "recovery",
      token_hash,
    });

    if (!error) {
      return NextResponse.redirect(new URL("/?confirmed=true", request.url));
    }
  }

  return NextResponse.redirect(new URL("/?error=confirmation_failed", request.url));
}
