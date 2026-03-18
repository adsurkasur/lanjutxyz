import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import QRSingle from "@/components/QRSingle";

vi.mock("@/hooks/useQR", async () => {
  const ReactModule = await import("react");
  return {
    useQRSingle: () => {
      const [text, setText] = ReactModule.useState("");
      const [result, setResult] = ReactModule.useState<string | null>(null);

      return {
        text,
        setText,
        logoPreview: undefined,
        handleLogoUpload: vi.fn(),
        removeLogo: vi.fn(),
        result,
        loading: false,
        generate: () => setResult("https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=demo"),
        setResult,
      };
    },
  };
});

describe("QRSingle", () => {
  it("renders text input and Generate QR button", () => {
    render(<QRSingle />);

    expect(screen.getByPlaceholderText("https://example.com")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Generate QR" })).toBeInTheDocument();
  });

  it("char counter shows 0/1000 initially", () => {
    render(<QRSingle />);

    expect(screen.getByText("0/1000")).toBeInTheDocument();
  });

  it("char counter updates when user types", async () => {
    const user = userEvent.setup();
    render(<QRSingle />);

    await user.type(screen.getByPlaceholderText("https://example.com"), "hello");

    expect(screen.getByText("5/1000")).toBeInTheDocument();
  });

  it("Generate button is disabled when text is empty", () => {
    render(<QRSingle />);

    expect(screen.getByRole("button", { name: "Generate QR" })).toBeDisabled();
  });

  it("Generate button is enabled when text has content", async () => {
    const user = userEvent.setup();
    render(<QRSingle />);

    await user.type(screen.getByPlaceholderText("https://example.com"), "https://example.com");

    expect(screen.getByRole("button", { name: "Generate QR" })).toBeEnabled();
  });

  it("result area appears after generation", async () => {
    const user = userEvent.setup();
    render(<QRSingle />);

    await user.type(screen.getByPlaceholderText("https://example.com"), "https://example.com");
    await user.click(screen.getByRole("button", { name: "Generate QR" }));

    expect(await screen.findByAltText("QR Code")).toBeInTheDocument();
  });
});