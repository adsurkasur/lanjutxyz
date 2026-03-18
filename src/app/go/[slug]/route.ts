import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const { data, error } = await supabase
    .from("links")
    .select("original_url, id")
    .eq("slug", slug)
    .single();

  if (error || !data) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  supabase
    .from("clicks")
    .insert({
      link_id: data.id,
      user_agent: request.headers.get("user-agent") ?? undefined,
    })
    .then(() => {});

  return NextResponse.redirect(data.original_url);
}