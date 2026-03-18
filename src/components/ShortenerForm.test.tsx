import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import ShortenerForm from "@/components/ShortenerForm";

function FormHarness({ isAuthenticated = false }: { isAuthenticated?: boolean }) {
  const [url, setUrl] = useState("");
  const [slug, setSlug] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ shortUrl: string; originalUrl: string } | null>(null);

  return (
    <ShortenerForm
      url={url}
      setUrl={setUrl}
      slug={slug}
      setSlug={setSlug}
      loading={false}
      shorten={() => setResult({ shortUrl: "tools.arinahub.com/go/demo1", originalUrl: url })}
      result={result}
      error={error}
      setError={setError}
      isAuthenticated={isAuthenticated}
      toggleAuth={vi.fn()}
    />
  );
}

describe("ShortenerForm", () => {
  it("renders URL input field", () => {
    render(<FormHarness />);

    expect(screen.getByPlaceholderText("Paste your long URL here")).toBeInTheDocument();
  });

  it("renders slug input field", () => {
    render(<FormHarness />);

    expect(screen.getByPlaceholderText("custom-slug (optional)")).toBeInTheDocument();
  });

  it("Shorten button is disabled when URL is empty", () => {
    render(<FormHarness />);

    expect(screen.getByRole("button", { name: "Shorten" })).toBeDisabled();
  });

  it("result card appears after shorten succeeds", async () => {
    const user = userEvent.setup();
    render(<FormHarness />);

    await user.type(screen.getByPlaceholderText("Paste your long URL here"), "https://example.com");
    await user.click(screen.getByRole("button", { name: "Shorten" }));

    expect(await screen.findByText("Your short link")).toBeInTheDocument();
  });

  it("result card contains short URL text", async () => {
    const user = userEvent.setup();
    render(<FormHarness />);

    await user.type(screen.getByPlaceholderText("Paste your long URL here"), "https://example.com");
    await user.click(screen.getByRole("button", { name: "Shorten" }));

    expect(await screen.findByText(/tools.arinahub.com\/go\/demo1/)).toBeInTheDocument();
  });

  it("shows Sign in to track clicks when not authenticated", async () => {
    const user = userEvent.setup();
    render(<FormHarness isAuthenticated={false} />);

    await user.type(screen.getByPlaceholderText("Paste your long URL here"), "https://example.com");
    await user.click(screen.getByRole("button", { name: "Shorten" }));

    expect(await screen.findByText(/Sign in to track clicks/i)).toBeInTheDocument();
  });
});