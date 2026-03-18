vi.mock("@/lib/supabase", () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
      single: vi.fn().mockResolvedValue({ data: null, error: null }),
      order: vi.fn().mockReturnThis(),
    })),
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: null }),
      getSession: vi.fn().mockResolvedValue({ data: { session: null }, error: null }),
      onAuthStateChange: vi.fn(() => ({ data: { subscription: { unsubscribe: vi.fn() } } })),
    },
  },
}));

import { afterEach, describe, expect, it, vi } from "vitest";
import { generateQRSingle, generateQRBulk } from "@/lib/api";

describe("generateQRSingle", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns success with image_base64 on 200 response", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ success: true, image_base64: "abc123" }),
      })
    );

    const result = await generateQRSingle({ text: "https://example.com" });

    expect(result.success).toBe(true);
    expect(result.image_base64).toBe("abc123");
  });

  it("throws when text is empty", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ success: true, image_base64: "x" }),
      })
    );

    await generateQRSingle({ text: "" });

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("/api/qr/single"),
      expect.objectContaining({ method: "POST" })
    );
  });

  it("throws NetworkError when fetch fails", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("fail")));

    await expect(generateQRSingle({ text: "test" })).rejects.toThrow("Network error");
  });
});

describe("generateQRBulk", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("calls onProgress after successful response", async () => {
    const mockBlob = new Blob(["zip"], { type: "application/zip" });

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        blob: async () => mockBlob,
      })
    );

    vi.stubGlobal("URL", {
      createObjectURL: vi.fn(() => "blob:x"),
      revokeObjectURL: vi.fn(),
    });

    const click = vi.fn();
    const originalCreateElement = document.createElement.bind(document);
    vi.spyOn(document, "createElement").mockImplementation(
      ((tagName: string) => {
        if (tagName === "a") {
          return { href: "", download: "", click } as unknown as HTMLElement;
        }

        return originalCreateElement(tagName);
      }) as typeof document.createElement
    );

    const onProgress = vi.fn();
    const items = [{ id: "1", text: "https://example.com" }];
    const result = await generateQRBulk(items, onProgress);

    expect(onProgress).toHaveBeenCalledWith(1, 1);
    expect(result.succeeded).toBe(1);
  });

  it("throws when response is not ok", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false }));

    await expect(generateQRBulk([{ id: "1", text: "x" }], vi.fn())).rejects.toThrow(
      "Bulk QR generation failed"
    );
  });
});
