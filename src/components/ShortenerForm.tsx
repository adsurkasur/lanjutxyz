"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Copy, Loader2, Link as LinkIcon, X } from "lucide-react";
import { useEffect } from "react";
import { toast } from "sonner";
import { buttonHover, buttonTap, buttonTransition, slideInVariants } from "@/lib/motion";

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
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleShorten = async () => {
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
          <h2 className="text-base font-semibold tracking-tight text-foreground sm:text-lg">Short links that mean something.</h2>
          <p className="mt-1 text-sm text-muted-foreground">Create branded, memorable links in seconds.</p>
        </div>
      )}

      <form 
        onSubmit={(e) => {
          e.preventDefault();
          void handleShorten();
        }}
        className="space-y-3"
      >
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Paste your long URL here"
          className="w-full rounded-lg border border-input bg-background px-4 py-3 text-base text-foreground placeholder:text-muted-foreground transition-shadow focus:outline-none focus:ring-2 focus:ring-primary/50 sm:text-sm"
        />
        <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center">
          <span className="shrink-0 text-xs text-muted-foreground">lanjut.xyz/</span>
          <input
            value={slug}
            onChange={(e) => setSlug(e.target.value.replace(/[^a-zA-Z0-9-]/g, ""))}
            placeholder="custom-slug (optional)"
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground transition-shadow focus:outline-none focus:ring-2 focus:ring-primary/50 sm:flex-1"
          />
        </div>

        <motion.button
          type="submit"
          whileHover={buttonHover}
          whileTap={buttonTap}
          transition={buttonTransition}
          disabled={!url.trim() || loading}
          className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary py-3 text-sm font-medium text-primary-foreground transition-opacity disabled:opacity-50"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <LinkIcon className="h-4 w-4" />}
          {loading ? "Shortening..." : "Shorten"}
        </motion.button>
      </form>

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
            variants={slideInVariants}
            initial="initial"
            animate="animate"
            exit="exit"
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
                whileHover={buttonHover}
                whileTap={buttonTap}
                transition={buttonTransition}
                onClick={copyUrl}
                className="cursor-pointer rounded-lg bg-primary p-2 text-primary-foreground"
              >
                <Copy className="h-4 w-4" />
              </motion.button>
            </div>
            <div className="mt-3 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
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
