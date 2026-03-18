// ============================================
// API Placeholders — Arina Tools
// All API calls are mocked for MVP.
// TODO: Replace each with actual fetch calls.
// ============================================

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
const shortBaseUrl =
  process.env.NEXT_PUBLIC_SHORT_BASE_URL ?? "https://arinahub.com/go/";
const shortBaseHostPath = shortBaseUrl
  .replace(/^https?:\/\//, "")
  .replace(/\/+$/, "") + "/";

// --- QR Single ---
// TODO: Replace with actual API call:
// POST {qrApiBaseUrl}/api/qr/single
// Header: X-API-Key from env NEXT_PUBLIC_QR_API_KEY
// Body: { text: string, logo_base64?: string }
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

// --- QR Bulk ---
// TODO: Replace with actual API call:
// POST {qrApiBaseUrl}/api/qr/bulk
// Body: { items: [{id, text, logo_base64?}], logo_base64?: string }
// Response: ZIP file (blob download)
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

// --- URL Shortener ---
// TODO: Connect to PocketBase
// POST /api/links
// Body: { url: string, slug?: string }
export async function shortenUrl(req: ShortenRequest): Promise<ShortenResponse> {
  if (!req.url.trim()) {
    throw new Error("URL is required");
  }

  const slug = req.slug || Math.random().toString(36).slice(2, 8);
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
    shortUrl: `${process.env.NEXT_PUBLIC_SHORT_BASE_URL ?? "https://arinahub.com/go/"}${slug}`,
    slug,
    originalUrl: req.url,
  };
}

function generateSlug(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

// --- Mock link data ---
export const mockLinks: LinkRecord[] = [
  { id: "1", shortUrl: `${shortBaseHostPath}abc123`, originalUrl: "https://example.com/very-long-url-here", clicks: 142, createdAt: "2025-01-15" },
  { id: "2", shortUrl: `${shortBaseHostPath}xyz789`, originalUrl: "https://github.com/arinahub/tools", clicks: 87, createdAt: "2025-01-18" },
  { id: "3", shortUrl: `${shortBaseHostPath}demo01`, originalUrl: "https://docs.arinahub.com/getting-started", clicks: 56, createdAt: "2025-01-20" },
  { id: "4", shortUrl: `${shortBaseHostPath}promo1`, originalUrl: "https://arinahub.com/pricing?ref=campaign", clicks: 231, createdAt: "2025-01-22" },
  { id: "5", shortUrl: `${shortBaseHostPath}meet99`, originalUrl: "https://cal.com/arinahub/30min", clicks: 19, createdAt: "2025-01-25" },
];
