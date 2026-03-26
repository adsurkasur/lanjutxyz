import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useShortener } from "@/hooks/useShortener";

vi.mock("@/hooks/useAuth", () => ({
  useAuth: () => ({ user: null }),
}));

const { shortenUrlMock } = vi.hoisted(() => ({
  shortenUrlMock: vi.fn(async ({ url, slug }: { url: string; slug?: string }) => ({
    shortUrl: `https://lanjut.xyz/${slug || "demo123"}`,
    slug: slug || "demo123",
    originalUrl: url,
  })),
}));

vi.mock("@/lib/api", () => ({
  shortenUrl: (payload: { url: string; slug?: string }) => shortenUrlMock(payload),
  fetchUserLinks: vi.fn(async () => []),
  deleteLink: vi.fn(async () => {}),
}));

describe("useShortener", () => {
  beforeEach(() => {
    shortenUrlMock.mockClear();
  });

  it("initial url is empty string", () => {
    const { result } = renderHook(() => useShortener());

    expect(result.current.url).toBe("");
  });

  it("initial slug is empty string", () => {
    const { result } = renderHook(() => useShortener());

    expect(result.current.slug).toBe("");
  });

  it("initial isAuthenticated is false", () => {
    const { result } = renderHook(() => useShortener());

    expect(result.current.isAuthenticated).toBe(false);
  });

  it("shorten adds a local link when url is valid", async () => {
    const { result } = renderHook(() => useShortener());
    const initialCount = result.current.links.length;

    act(() => {
      result.current.setUrl("https://example.com");
    });

    await act(async () => {
      await result.current.shorten();
    });

    expect(result.current.links.length).toBe(initialCount + 1);
    expect(shortenUrlMock).toHaveBeenCalledOnce();
  });

  it("shorten does not add link when url is empty", async () => {
    const { result } = renderHook(() => useShortener());
    const initialCount = result.current.links.length;

    await act(async () => {
      await result.current.shorten();
    });

    expect(result.current.links.length).toBe(initialCount);
    expect(shortenUrlMock).not.toHaveBeenCalled();
  });
});
