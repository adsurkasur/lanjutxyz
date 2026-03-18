import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  );

  const { data, error } = await supabase
    .from("links")
    .select("original_url")
    .eq("slug", slug)
    .maybeSingle();

  if (error || !data) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  const target = data.original_url.startsWith("http")
    ? data.original_url
    : `https://${data.original_url}`;

  try {
    new URL(target);
  } catch {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.redirect(target, { status: 302 });
}