"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Copy, Loader2, Link as LinkIcon } from "lucide-react";
import { toast } from "sonner";

const shortBaseUrl =
  process.env.NEXT_PUBLIC_SHORT_BASE_URL ?? "https://arinahub.com/go/";
const shortBaseHostPath = shortBaseUrl.replace(/^https?:\/\//, "");

interface Props {
  url: string;
  setUrl: (v: string) => void;
  slug: string;
  setSlug: (v: string) => void;
  loading: boolean;
  shorten: () => void;
  result: { shortUrl: string; originalUrl: string } | null;
  isAuthenticated: boolean;
  toggleAuth: () => void;
}

export default function ShortenerForm({ url, setUrl, slug, setSlug, loading, shorten, result, isAuthenticated, toggleAuth }: Props) {
  const copyUrl = () => {
    if (!result) return;
    navigator.clipboard.writeText(`https://${result.shortUrl}`);
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
          <span className="shrink-0 text-xs text-muted-foreground">{shortBaseHostPath}</span>
          <input
            value={slug}
            onChange={(e) => setSlug(e.target.value.replace(/[^a-zA-Z0-9-]/g, ""))}
            placeholder="custom-slug (optional)"
            className="flex-1 rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
          />
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={shorten}
          disabled={!url.trim() || loading}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-3 text-sm font-medium text-primary-foreground transition-opacity disabled:opacity-50"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <LinkIcon className="h-4 w-4" />}
          {loading ? "Shortening..." : "Shorten"}
        </motion.button>
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
              <code className="flex-1 truncate rounded-lg bg-secondary px-3 py-2 text-sm font-medium text-foreground">
                https://{result.shortUrl}
              </code>
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
                src={`https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=https://${result.shortUrl}`}
                alt="QR"
                className="h-16 w-16 rounded"
              />
              <div className="flex-1 text-xs text-muted-foreground">
                <p className="truncate">{result.originalUrl}</p>
                {!isAuthenticated && (
                  <button onClick={toggleAuth} className="mt-1 font-medium text-primary hover:underline">
                    Sign in to track clicks →
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
