import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import QRBulk from "@/components/QRBulk";

const mockUseQRBulk = vi.fn();

vi.mock("@/hooks/useQR", () => ({
  useQRBulk: () => mockUseQRBulk(),
}));

describe("QRBulk", () => {
  beforeEach(() => {
    mockUseQRBulk.mockReturnValue({
      items: [],
      progress: 0,
      total: 0,
      processing: false,
      done: false,
      summary: null,
      parseCSV: vi.fn(),
      generateAll: vi.fn(),
      reset: vi.fn(),
    });
  });

  it("renders CSV dropzone", () => {
    render(<QRBulk />);

    expect(screen.getByText("Drop CSV file here or click to browse")).toBeInTheDocument();
  });

  it("renders Download sample CSV button", () => {
    render(<QRBulk />);

    expect(screen.getByRole("button", { name: /Download sample CSV/i })).toBeInTheDocument();
  });

  it("preview table appears when items are present", () => {
    mockUseQRBulk.mockReturnValue({
      items: [{ id: "row-1", text: "https://example.com" }],
      progress: 0,
      total: 1,
      processing: false,
      done: false,
      summary: null,
      parseCSV: vi.fn(),
      generateAll: vi.fn(),
      reset: vi.fn(),
    });

    render(<QRBulk />);

    expect(screen.getByRole("table")).toBeInTheDocument();
  });

  it("progress bar appears when generating", () => {
    mockUseQRBulk.mockReturnValue({
      items: [{ id: "row-1", text: "https://example.com" }],
      progress: 1,
      total: 2,
      processing: true,
      done: false,
      summary: null,
      parseCSV: vi.fn(),
      generateAll: vi.fn(),
      reset: vi.fn(),
    });

    render(<QRBulk />);

    expect(screen.getByText("1/2 processed")).toBeInTheDocument();
  });

  it("success summary appears after completion", () => {
    mockUseQRBulk.mockReturnValue({
      items: [{ id: "row-1", text: "https://example.com" }],
      progress: 1,
      total: 1,
      processing: false,
      done: true,
      summary: { succeeded: 1, failed: 0, errors: [] },
      parseCSV: vi.fn(),
      generateAll: vi.fn(),
      reset: vi.fn(),
    });

    render(<QRBulk />);

    expect(screen.getByText("Succeeded")).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument();
  });
});