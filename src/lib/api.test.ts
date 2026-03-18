import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  generateQRSingle,
  generateQRBulk,
  shortenUrl,
  type QRBulkItem,
} from "@/lib/api";

describe("api", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("generateQRSingle returns success payload on valid input", async () => {
    const result = await generateQRSingle({ text: "https://example.com" });

    expect(result.success).toBe(true);
    expect(typeof result.image_base64).toBe("string");
    expect(result.image_base64.length).toBeGreaterThan(0);
  });

  it("generateQRSingle returns error when text is empty", async () => {
    const result = await generateQRSingle({ text: "" });

    expect(result.success).toBe(false);
    expect(result.error).toBeTruthy();
  });

  it("generateQRBulk calls onProgress for each valid item", async () => {
    const onProgress = vi.fn();
    const items: QRBulkItem[] = [
      { id: "1", text: "A" },
      { id: "2", text: "B" },
      { id: "3", text: "" },
    ];

    await generateQRBulk(items, onProgress);

    expect(onProgress).toHaveBeenCalledTimes(2);
    expect(onProgress).toHaveBeenLastCalledWith(2, 2);
  });

  it("generateQRBulk skips items with empty text field", async () => {
    const result = await generateQRBulk(
      [
        { id: "1", text: "hello" },
        { id: "2", text: "" },
      ],
      vi.fn()
    );

    expect(result.succeeded).toBe(1);
    expect(result.failed).toBe(1);
    expect(result.errors[0]).toContain("empty text");
  });

  it("shortenUrl returns object containing shortUrl", async () => {
    const result = await shortenUrl({ url: "https://example.com" });

    expect(typeof result.shortUrl).toBe("string");
    expect(result.shortUrl.length).toBeGreaterThan(0);
  });
});