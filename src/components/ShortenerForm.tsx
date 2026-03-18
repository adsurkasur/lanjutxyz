"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Copy, Loader2, Link as LinkIcon, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import TurnstileWidget from "@/components/TurnstileWidget";
import { verifyCaptcha } from "@/lib/captcha";

interface Props {
  url: string;
  setUrl: (v: string) => void;
  slug: string;
  setSlug: (v: string) => void;
  loading: boolean;
  shorten: () => void | Promise<void>;
  result: { shortUrl: string; originalUrl: string } | null;
  error: string | null;
  setError: (v: string | null) => void;
  isAuthenticated: boolean;
}

export default function ShortenerForm({ url, setUrl, slug, setSlug, loading, shorten, result, error, setError, isAuthenticated }: Props) {
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [captchaVerified, setCaptchaVerified] = useState(false);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  useEffect(() => {
    if (result) {
      setCaptchaToken(null);
      setCaptchaVerified(false);
    }
  }, [result]);

  const handleShorten = async () => {
    if (captchaToken) {
      const valid = await verifyCaptcha(captchaToken);
      if (!valid) {
        setError("Captcha verification failed. Please try again.");
        setCaptchaVerified(false);
        return;
      }
    }

    await shorten();
  };

  const copyUrl = () => {
    if (!result) return;
    navigator.clipboard.writeText(result.shortUrl);
    toast.success("Copied to clipboard");
  };

  return (
    <div className="space-y-6">
      {!isAuthenticated && (
        <div className="text-center">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">Short links that mean something.</h2>
          <p className="mt-1 text-sm text-muted-foreground">Create branded, memorable links in seconds.</p>
        </div>
      )}

      <div className="space-y-3">
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Paste your long URL here"
          className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
        />
        <div className="flex items-center gap-2">
          <span className="shrink-0 text-xs text-muted-foreground">arinahub.com/go/</span>
          <input
            value={slug}
            onChange={(e) => setSlug(e.target.value.replace(/[^a-zA-Z0-9-]/g, ""))}
            placeholder="custom-slug (optional)"
            className="flex-1 rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
          />
        </div>

        <TurnstileWidget
          onVerify={(token) => {
            setCaptchaToken(token);
            setCaptchaVerified(true);
          }}
          onError={() => {
            setCaptchaToken(null);
            setCaptchaVerified(false);
          }}
        />

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => {
            void handleShorten();
          }}
          disabled={!url.trim() || loading || (!!process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && !captchaVerified)}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-3 text-sm font-medium text-primary-foreground transition-opacity disabled:opacity-50"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <LinkIcon className="h-4 w-4" />}
          {loading ? "Shortening..." : "Shorten"}
        </motion.button>

        {error && (
          <div className="flex items-center justify-between rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2">
            <p className="text-sm text-destructive">{error}</p>
            <button
              onClick={() => setError(null)}
              className="rounded p-1 text-destructive/80 transition-colors hover:text-destructive"
              aria-label="Dismiss error"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="rounded-xl border border-border bg-card p-5 card-glow"
          >
            <p className="text-xs text-muted-foreground">Your short link</p>
            <div className="mt-2 flex items-center gap-2">
              <a
                href={result.shortUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 truncate rounded-lg bg-secondary px-3 py-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
              >
                {result.shortUrl}
              </a>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={copyUrl}
                className="rounded-lg bg-primary p-2 text-primary-foreground"
              >
                <Copy className="h-4 w-4" />
              </motion.button>
            </div>
            <div className="mt-3 flex items-center gap-3">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=${result.shortUrl}`}
                alt="QR"
                className="h-16 w-16 rounded"
              />
              <div className="flex-1 text-xs text-muted-foreground">
                <p className="truncate">{result.originalUrl}</p>
                {!isAuthenticated && (
                  <p className="mt-1 text-xs text-muted-foreground">Sign in to track clicks and manage your links.</p>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
