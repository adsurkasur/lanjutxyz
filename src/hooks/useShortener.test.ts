import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useShortener } from "@/hooks/useShortener";

describe("useShortener", () => {
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

  it("toggleAuth switches isAuthenticated to true", () => {
    const { result } = renderHook(() => useShortener());

    act(() => {
      result.current.toggleAuth();
    });

    expect(result.current.isAuthenticated).toBe(true);
  });

  it("shorten adds a link to links array when url is valid", async () => {
    const { result } = renderHook(() => useShortener());
    const initialCount = result.current.links.length;

    act(() => {
      result.current.toggleAuth();
      result.current.setUrl("https://example.com");
    });

    await act(async () => {
      await result.current.shorten();
    });

    expect(result.current.links.length).toBe(initialCount + 1);
  });

  it("shorten does not add link when url is empty", async () => {
    const { result } = renderHook(() => useShortener());
    const initialCount = result.current.links.length;

    await act(async () => {
      await result.current.shorten();
    });

    expect(result.current.links.length).toBe(initialCount);
  });
});