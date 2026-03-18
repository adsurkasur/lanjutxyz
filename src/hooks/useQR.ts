"use client";

import { useState, useCallback } from "react";
import { generateQRSingle, generateQRBulk, type QRBulkItem } from "@/lib/api";

export function useQRSingle() {
  const [text, setText] = useState("");
  const [logoBase64, setLogoBase64] = useState<string | undefined>();
  const [logoPreview, setLogoPreview] = useState<string | undefined>();
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogoUpload = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      setLogoBase64(base64);
      setLogoPreview(base64);
    };
    reader.readAsDataURL(file);
  }, []);

  const removeLogo = useCallback(() => {
    setLogoBase64(undefined);
    setLogoPreview(undefined);
  }, []);

  const generate = useCallback(async () => {
    if (!text.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await generateQRSingle({ text, logo_base64: logoBase64 });
      setResult(`data:image/png;base64,${res.image_base64}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate QR code");
    } finally {
      setLoading(false);
    }
  }, [text, logoBase64]);

  return {
    text,
    setText,
    logoPreview,
    handleLogoUpload,
    removeLogo,
    result,
    loading,
    error,
    setError,
    generate,
    setResult,
  };
}

export function useQRBulk() {
  const [items, setItems] = useState<QRBulkItem[]>([]);
  const [progress, setProgress] = useState(0);
  const [total, setTotal] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState(false);
  const [summary, setSummary] = useState<{ succeeded: number; failed: number; errors: string[] } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const parseCSV = useCallback((csvText: string) => {
    const lines = csvText.trim().split("\n");
    const parsed: QRBulkItem[] = [];
    for (let i = 1; i < lines.length; i++) {
      const parts = lines[i].split(",");
      const text = parts[1]?.trim() || "";
      if (parts.length >= 2 && text) {
        parsed.push({
          id: parts[0]?.trim() || `row-${i}`,
          text,
          logo_base64: parts[2]?.trim() || undefined,
        });
      }
    }
    setItems(parsed);
    setDone(false);
    setSummary(null);
    setError(null);
    setProgress(0);
  }, []);

  const generateAll = useCallback(async () => {
    setProcessing(true);
    setTotal(items.length);
    setProgress(0);

    try {
      const result = await generateQRBulk(items, (completed, t) => {
        setProgress(completed);
        setTotal(t);
      });
      setSummary(result);
      setDone(true);
      setError(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Bulk QR generation failed";
      setError(message);
      setSummary({ succeeded: 0, failed: items.length, errors: [message] });
      setDone(true);
    } finally {
      setProcessing(false);
    }
  }, [items]);

  const reset = useCallback(() => {
    setItems([]);
    setProgress(0);
    setTotal(0);
    setProcessing(false);
    setDone(false);
    setSummary(null);
    setError(null);
  }, []);

  return { items, setItems, progress, total, processing, done, summary, error, parseCSV, generateAll, reset };
}
