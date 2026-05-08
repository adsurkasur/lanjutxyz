import { pb } from "@/lib/pocketbase";

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

const qrApiKey = process.env.NEXT_PUBLIC_QR_API_KEY ?? "";
const shortBaseUrlRaw = process.env.NEXT_PUBLIC_SHORT_BASE_URL ?? "https://lanjut.xyz/";
const shortBaseUrl = shortBaseUrlRaw.endsWith("/") ? shortBaseUrlRaw : `${shortBaseUrlRaw}/`;

export function makeShortUrl(slug: string): string {
  return `${shortBaseUrl}${slug}`;
}

export async function generateQRSingle(req: QRSingleRequest): Promise<QRSingleResponse> {
  let response: Response;

  try {
    response = await fetch(`/api/qr-proxy/single`, {
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
  const response = await fetch(`/api/qr-proxy/bulk`, {
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
    
    try {
      await pb.collection("links").getFirstListItem(`slug="${slug}"`);
    } catch {
      // If error (not found), then slug is unique
      return slug;
    }
  }
  return Date.now().toString(36);
}

export async function shortenUrl(req: ShortenRequest): Promise<ShortenResponse> {
  if (!req.url.trim()) {
    throw new Error("URL is required");
  }

  const slug = req.slug?.trim() || await generateUniqueSlug();
  
  try {
    const record = await pb.collection("links").create({
      slug,
      original_url: req.url,
      user_id: pb.authStore.model?.id || null,
    });

    return {
      shortUrl: makeShortUrl(record.slug),
      slug: record.slug,
      originalUrl: record.original_url,
    };
  } catch (err: any) {
    throw new Error(err.message || "Failed to create short link");
  }
}

export async function fetchUserLinks(userId: string): Promise<LinkRecord[]> {
  try {
    const records = await pb.collection("links").getFullList({
      filter: `user_id = "${userId}"`,
      sort: "-created",
    });

    return records.map((item) => ({
      id: item.id,
      shortUrl: makeShortUrl(item.slug),
      originalUrl: item.original_url,
      clicks: item.click_count ?? 0,
      createdAt: (item.created ?? "").split(" ")[0] || "",
    }));
  } catch (err: any) {
    throw new Error(err.message || "Failed to load links");
  }
}

export async function deleteLink(id: string): Promise<void> {
  try {
    await pb.collection("links").delete(id);
  } catch (err: any) {
    throw new Error(err.message || "Failed to delete link");
  }
}
