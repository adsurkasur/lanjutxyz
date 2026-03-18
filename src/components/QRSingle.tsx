"use client";

import { useQRSingle } from "@/hooks/useQR";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, X, Download, Copy, Loader2 } from "lucide-react";
import { useCallback, useRef } from "react";
import { toast } from "sonner";
import {
  fadeVariants,
  slideInVariants,
  buttonHover,
  buttonTap,
  buttonTransition,
} from "@/lib/motion";

export default function QRSingle() {
  const { text, setText, logoPreview, handleLogoUpload, removeLogo, result, loading, error, setError, generate, setResult } = useQRSingle();
  const fileRef = useRef<HTMLInputElement>(null);
  const maxChars = 1000;

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file && /image\/(png|jpe?g|webp|svg\+xml)/.test(file.type)) {
        handleLogoUpload(file);
      }
    },
    [handleLogoUpload]
  );

  const copyImage = useCallback(async () => {
    if (!result) return;
    try {
      const res = await fetch(result);
      const blob = await res.blob();
      await navigator.clipboard.write([new ClipboardItem({ [blob.type]: blob })]);
      toast.success("Image copied to clipboard");
    } catch {
      toast.error("Failed to copy image");
    }
  }, [result]);

  const downloadImage = useCallback(() => {
    if (!result) return;
    const a = document.createElement("a");
    a.href = result;
    a.download = "qr-code.png";
    a.click();
    toast.success("Download started");
  }, [result]);

  return (
    <div className="space-y-6">
      {/* Text Input */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-foreground">Enter URL or text</label>
          <span className="text-xs text-muted-foreground">{text.length}/{maxChars}</span>
        </div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value.slice(0, maxChars))}
          onKeyDown={(e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
              e.preventDefault();
              if (!loading && text.trim()) {
                void generate();
              }
            }
          }}
          placeholder="https://example.com"
          rows={3}
          className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow resize-none"
        />
      </div>

      {/* Logo Upload */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Logo (optional)</label>
        {logoPreview ? (
          <div className="flex items-center gap-3 rounded-xl border border-input bg-secondary/50 p-3">
            <img src={logoPreview} alt="Logo" className="h-10 w-10 rounded object-contain" />
            <span className="flex-1 text-sm text-muted-foreground">Logo uploaded</span>
            <button onClick={removeLogo} className="rounded p-1 text-muted-foreground hover:text-foreground transition-colors">
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div
            onDrop={onDrop}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => fileRef.current?.click()}
            className="flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed border-input py-8 text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
          >
            <Upload className="h-5 w-5" />
            <span className="text-sm">Drag & drop or click to upload</span>
            <span className="text-xs">PNG, JPG, WebP, SVG</span>
          </div>
        )}
        <input
          ref={fileRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/svg+xml"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && handleLogoUpload(e.target.files[0])}
        />
      </div>

      {/* Generate Button */}
      <motion.button
        whileHover={buttonHover}
        whileTap={buttonTap}
        transition={buttonTransition}
        onClick={generate}
        disabled={!text.trim() || loading}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-3 text-sm font-medium text-primary-foreground transition-opacity disabled:opacity-50"
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        {loading ? "Generating..." : "Generate QR"}
      </motion.button>

      <p className="text-center text-xs text-muted-foreground">Tip: press Ctrl+Enter (or Cmd+Enter) to generate</p>

      {error && (
        <motion.div
          variants={slideInVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="flex items-center justify-between rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2"
        >
          <p className="text-sm text-destructive">{error}</p>
          <button
            onClick={() => setError(null)}
            className="rounded p-1 text-destructive/80 transition-colors hover:text-destructive"
            aria-label="Dismiss error"
          >
            <X className="h-4 w-4" />
          </button>
        </motion.div>
      )}

      {/* Result */}
      <AnimatePresence>
        {result && (
          <motion.div
            variants={fadeVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="flex flex-col items-center gap-4 rounded-xl border border-border bg-card p-5 card-glow"
          >
            <img src={result} alt="QR Code" className="h-64 w-64 rounded-lg" />
            <div className="flex gap-2">
              <motion.button
                whileHover={buttonHover}
                whileTap={buttonTap}
                transition={buttonTransition}
                onClick={downloadImage}
                className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
              >
                <Download className="h-4 w-4" /> Download PNG
              </motion.button>
              <motion.button
                whileHover={buttonHover}
                whileTap={buttonTap}
                transition={buttonTransition}
                onClick={copyImage}
                className="flex items-center gap-2 rounded-lg border border-border bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground"
              >
                <Copy className="h-4 w-4" /> Copy
              </motion.button>
            </div>
            <button onClick={() => setResult(null)} className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              Clear result
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
