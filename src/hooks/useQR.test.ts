import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useQRSingle, useQRBulk } from "@/hooks/useQR";

describe("useQR", () => {
  it("useQRSingle initial text is empty string", () => {
    const { result } = renderHook(() => useQRSingle());

    expect(result.current.text).toBe("");
  });

  it("useQRSingle setText updates text state", () => {
    const { result } = renderHook(() => useQRSingle());

    act(() => {
      result.current.setText("hello");
    });

    expect(result.current.text).toBe("hello");
  });

  it("useQRSingle result is null initially", () => {
    const { result } = renderHook(() => useQRSingle());

    expect(result.current.result).toBeNull();
  });

  it("useQRBulk items is empty array initially", () => {
    const { result } = renderHook(() => useQRBulk());

    expect(result.current.items).toEqual([]);
  });

  it("useQRBulk parseCSV returns correct number of rows for valid CSV", () => {
    const { result } = renderHook(() => useQRBulk());

    act(() => {
      result.current.parseCSV("id,text\nrow-1,hello\nrow-2,world");
    });

    expect(result.current.items).toHaveLength(2);
  });

  it("useQRBulk parseCSV skips rows with empty text column", () => {
    const { result } = renderHook(() => useQRBulk());

    act(() => {
      result.current.parseCSV("id,text\nrow-1,hello\nrow-2,");
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0]?.id).toBe("row-1");
  });
});