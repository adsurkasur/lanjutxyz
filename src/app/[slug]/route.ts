import { NextRequest, NextResponse } from "next/server";
import PocketBase from "pocketbase";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL || "https://pb.adsurkasur.my.id");

  // Add Cloudflare Access Service Token headers if available
  const clientId = process.env.CF_ACCESS_CLIENT_ID;
  const clientSecret = process.env.CF_ACCESS_CLIENT_SECRET;

  if (clientId && clientSecret) {
    pb.beforeSend = function (url, options) {
      options.headers = {
        ...options.headers,
        "CF-Access-Client-Id": clientId,
        "CF-Access-Client-Secret": clientSecret,
      };
      return { url, options };
    };
  }

  try {
    const record = await pb.collection("links").getFirstListItem(`slug="${slug}"`);

    const target = record.original_url.startsWith("http")
      ? record.original_url
      : `https://${record.original_url}`;

    try {
      new URL(target);
    } catch {
      return NextResponse.redirect(new URL("/", request.url));
    }

    // Increment click count asynchronously (fire and forget in this context or wait if desired)
    void pb.collection("links").update(record.id, {
      "click_count+": 1,
    });

    return NextResponse.redirect(target, { status: 302 });
  } catch {
    // If slug not found or error, redirect to home
    return NextResponse.redirect(new URL("/", request.url));
  }
}
