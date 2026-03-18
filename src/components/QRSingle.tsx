"use client";

import { useQRSingle } from "@/hooks/useQR";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, X, Download, Copy, Loader2 } from "lucide-react";
import { useCallback, useRef } from "react";
import { toast } from "sonner";

export default function QRSingle() {
  const { text, setText, logoPreview, handleLogoUpload, removeLogo, result, loading, generate, setResult } = useQRSingle();
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
          placeholder="https://example.com"
          rows={3}
          className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow resize-none"
        />
      </div>

      {/* Logo Upload */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Logo (optional)</label>
        {logoPreview ? (
          <div className="flex items-center gap-3 rounded-lg border border-input bg-secondary/50 p-3">
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
            className="flex cursor-pointer flex-col items-center gap-2 rounded-lg border-2 border-dashed border-input py-8 text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
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
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        onClick={generate}
        disabled={!text.trim() || loading}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-3 text-sm font-medium text-primary-foreground transition-opacity disabled:opacity-50"
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        {loading ? "Generating..." : "Generate QR"}
      </motion.button>

      {/* Result */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="flex flex-col items-center gap-4 rounded-xl border border-border bg-card p-6 card-glow"
          >
            <img src={result} alt="QR Code" className="h-64 w-64 rounded-lg" />
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={downloadImage}
                className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
              >
                <Download className="h-4 w-4" /> Download PNG
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
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
