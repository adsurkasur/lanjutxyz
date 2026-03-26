import { supabase } from "@/lib/supabase";

export interface QRSingleRequest {
  text: string;
  logo_base64?: string;
}

export interface QRSingleResponse {
  success: boolean;
  image_base64: string;
  error?: string;
}

export interface QRBulkItem {
  id: string;
  text: string;
  logo_base64?: string;
}

export interface ShortenRequest {
  url: string;
  slug?: string;
}

export interface ShortenResponse {
  shortUrl: string;
  slug: string;
  originalUrl: string;
}

export interface LinkRecord {
  id: string;
  shortUrl: string;
  originalUrl: string;
  clicks: number;
  createdAt: string;
}

const qrApiBaseUrl = process.env.NEXT_PUBLIC_QR_API_URL ?? "https://qr.adsurkasur.my.id";
const qrApiKey = process.env.NEXT_PUBLIC_QR_API_KEY ?? "";
const shortBaseUrlRaw = process.env.NEXT_PUBLIC_SHORT_BASE_URL ?? "https://lanjut.xyz/";
const shortBaseUrl = shortBaseUrlRaw.endsWith("/") ? shortBaseUrlRaw : `${shortBaseUrlRaw}/`;

export function makeShortUrl(slug: string): string {
  return `${shortBaseUrl}${slug}`;
}

export async function generateQRSingle(req: QRSingleRequest): Promise<QRSingleResponse> {
  let response: Response;

  try {
    response = await fetch(`${qrApiBaseUrl}/api/qr/single`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": qrApiKey,
      },
      body: JSON.stringify({ text: req.text, logo_base64: req.logo_base64 }),
    });
  } catch {
    throw new Error("Network error: could not reach QR API");
  }

  const payload = (await response.json()) as QRSingleResponse;

  if (payload.success === true) {
    return { success: true, image_base64: payload.image_base64 };
  }

  throw new Error(payload.error);
}

export async function generateQRBulk(
  items: QRBulkItem[],
  onProgress: (completed: number, total: number) => void
): Promise<{ succeeded: number; failed: number; errors: string[] }> {
  const response = await fetch(`${qrApiBaseUrl}/api/qr/bulk`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": qrApiKey,
    },
    body: JSON.stringify({ items }),
  });

  if (!response.ok) {
    throw new Error("Bulk QR generation failed");
  }

  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `qr_bulk_${Date.now()}.zip`;
  a.click();
  URL.revokeObjectURL(url);

  onProgress(items.length, items.length);
  return { succeeded: items.length, failed: 0, errors: [] };
}

async function generateUniqueSlug(): Promise<string> {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  for (let attempt = 0; attempt < 5; attempt++) {
    const slug = Array.from({ length: 7 }, () =>
      chars[Math.floor(Math.random() * chars.length)]
    ).join("");
    const { data } = await supabase
      .from("links")
      .select("slug")
      .eq("slug", slug)
      .maybeSingle();
    if (!data) return slug;
  }
  return Date.now().toString(36);
}

export async function shortenUrl(req: ShortenRequest): Promise<ShortenResponse> {
  if (!req.url.trim()) {
    throw new Error("URL is required");
  }

  const slug = req.slug?.trim() || await generateUniqueSlug();
  const { data, error } = await supabase
    .from("links")
    .insert({
      slug,
      original_url: req.url,
      user_id: (await supabase.auth.getUser()).data.user?.id ?? null,
    })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  void data;

  return {
    shortUrl: makeShortUrl(slug),
    slug,
    originalUrl: req.url,
  };
}

export async function fetchUserLinks(userId: string): Promise<LinkRecord[]> {
  const { data, error } = await supabase
    .from("links")
    .select("id, slug, original_url, click_count, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message || "Failed to load links");
  }

  return (data || []).map((item) => ({
    id: String(item.id),
    shortUrl: makeShortUrl(item.slug),
    originalUrl: item.original_url,
    clicks: item.click_count ?? 0,
    createdAt: (item.created_at ?? "").split("T")[0] || "",
  }));
}

export async function deleteLink(id: string): Promise<void> {
  const { error } = await supabase.from("links").delete().eq("id", id);
  if (error) {
    throw new Error(error.message || "Failed to delete link");
  }
}
