"use client";

import { Turnstile } from "@marsidev/react-turnstile";

interface Props {
  onVerify: (token: string) => void;
  onError?: () => void;
}

export default function TurnstileWidget({ onVerify, onError }: Props) {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  // Dev mode: auto-verify with placeholder token.
  if (!siteKey) {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-border bg-secondary/50 px-3 py-2 text-xs text-muted-foreground">
        <div className="h-2 w-2 rounded-full bg-green-500" />
        Security check bypassed (dev mode)
        <button
          type="button"
          onClick={() => onVerify("dev-token")}
          className="ml-auto text-xs text-primary hover:underline"
        >
          Verify
        </button>
      </div>
    );
  }

  return (
    <Turnstile
      siteKey={siteKey}
      onSuccess={onVerify}
      onError={onError}
      options={{ theme: "auto" }}
    />
  );
}
