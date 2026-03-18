// ============================================
// API Placeholders — Arina Tools
// All API calls are mocked for MVP.
// TODO: Replace each with actual fetch calls.
// ============================================

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
  if (!req.text.trim()) {
    return { success: false, image_base64: "", error: "Text is required" };
  }

  void qrApiKey;
  void qrApiBaseUrl;

  // Mock: use public QR API as stand-in
  const url = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(req.text)}`;
  return { success: true, image_base64: url };
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
  const total = items.filter((i) => i.text.trim()).length;
  let succeeded = 0;
  let failed = 0;
  let completed = 0;
  const errors: string[] = [];

  for (let i = 0; i < items.length; i++) {
    if (!items[i].text.trim()) {
      failed++;
      errors.push(`Row ${items[i].id}: empty text`);
      continue;
    }
    // Simulate processing delay
    await new Promise((r) => setTimeout(r, 400));
    succeeded++;
    completed++;
    onProgress(completed, total);
  }

  return { succeeded, failed, errors };
}

// --- URL Shortener ---
// TODO: Connect to PocketBase
// POST /api/links
// Body: { url: string, slug?: string }
export async function shortenUrl(req: ShortenRequest): Promise<ShortenResponse> {
  if (!req.url.trim()) {
    throw new Error("URL is required");
  }

  await new Promise((r) => setTimeout(r, 600));
  const slug = req.slug || generateSlug();
  return {
    shortUrl: `${shortBaseHostPath}${slug}`,
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
