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

import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useQRSingle, useQRBulk } from "@/hooks/useQR";

describe("useQRSingle", () => {
  it("has empty text initially", () => {
    const { result } = renderHook(() => useQRSingle());
    expect(result.current.text).toBe("");
  });

  it("updates text via setText", () => {
    const { result } = renderHook(() => useQRSingle());
    act(() => result.current.setText("hello"));
    expect(result.current.text).toBe("hello");
  });

  it("has null result initially", () => {
    const { result } = renderHook(() => useQRSingle());
    expect(result.current.result).toBeNull();
  });

  it("has null error initially", () => {
    const { result } = renderHook(() => useQRSingle());
    expect(result.current.error).toBeNull();
  });
});

describe("useQRBulk", () => {
  it("has empty items initially", () => {
    const { result } = renderHook(() => useQRBulk());
    expect(result.current.items).toEqual([]);
  });

  it("parseCSV returns correct row count", () => {
    const { result } = renderHook(() => useQRBulk());
    const csv = "id,text\nrow-1,https://example.com\nrow-2,Hello";

    act(() => result.current.parseCSV(csv));

    expect(result.current.items).toHaveLength(2);
  });

  it("parseCSV skips rows with empty text", () => {
    const { result } = renderHook(() => useQRBulk());
    const csv = "id,text\nrow-1,\nrow-2,Hello";

    act(() => result.current.parseCSV(csv));

    expect(result.current.items).toHaveLength(1);
  });
});
