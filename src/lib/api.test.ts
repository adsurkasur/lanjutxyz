import { afterEach, describe, expect, it, vi } from "vitest";
import { generateQRSingle, generateQRBulk, shortenUrl, fetchUserLinks, deleteLink } from "@/lib/api";

const { pbMock } = vi.hoisted(() => ({
  pbMock: {
    collection: vi.fn(() => ({
      getFirstListItem: vi.fn(),
      create: vi.fn(),
      getFullList: vi.fn(),
      delete: vi.fn(),
    })),
    authStore: {
      model: { id: "user123" },
    },
  },
}));

vi.mock("@/lib/pocketbase", () => ({
  pb: pbMock,
}));

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
});

describe("shortenUrl", () => {
  it("creates a record in PocketBase", async () => {
    const mockRecord = { slug: "test-slug", original_url: "https://example.com" };
    const createMock = vi.fn().mockResolvedValue(mockRecord);
    vi.mocked(pbMock.collection).mockReturnValue({
      create: createMock,
      getFirstListItem: vi.fn().mockRejectedValue(new Error("not found")),
    } as any);

    const result = await shortenUrl({ url: "https://example.com", slug: "test-slug" });

    expect(result.slug).toBe("test-slug");
    expect(createMock).toHaveBeenCalledWith(
      expect.objectContaining({ slug: "test-slug", original_url: "https://example.com" })
    );
  });
});

describe("fetchUserLinks", () => {
  it("returns mapped LinkRecord array", async () => {
    const mockRecords = [
      { id: "1", slug: "s1", original_url: "url1", click_count: 5, created: "2024-01-01 10:00:00" },
    ];
    vi.mocked(pbMock.collection).mockReturnValue({
      getFullList: vi.fn().mockResolvedValue(mockRecords),
    } as any);

    const result = await fetchUserLinks("user123");

    expect(result).toHaveLength(1);
    expect(result[0].shortUrl).toContain("s1");
    expect(result[0].id).toBe("1");
    expect(result[0].clicks).toBe(5);
  });
});

describe("deleteLink", () => {
  it("calls delete on the collection", async () => {
    const deleteMock = vi.fn().mockResolvedValue(null);
    vi.mocked(pbMock.collection).mockReturnValue({
      delete: deleteMock,
    } as any);

    await deleteLink("rec123");

    expect(deleteMock).toHaveBeenCalledWith("rec123");
  });
});
