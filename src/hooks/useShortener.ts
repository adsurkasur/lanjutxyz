"use client";

import { useState, useCallback } from "react";
import { shortenUrl, type ShortenResponse, type LinkRecord } from "@/lib/api";

export function useShortener() {
  const [url, setUrl] = useState("");
  const [slug, setSlug] = useState("");
  const [result, setResult] = useState<ShortenResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [links, setLinks] = useState<LinkRecord[]>([]);

  const shorten = useCallback(async () => {
    if (!url.trim()) return;
    setLoading(true);
    try {
      setError(null);
      const res = await shortenUrl({ url, slug: slug || undefined });
      setResult(res);
      setLinks((prev) => [
        { id: String(Date.now()), shortUrl: res.shortUrl, originalUrl: res.originalUrl, clicks: 0, createdAt: new Date().toISOString().split("T")[0] },
        ...prev,
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [url, slug]);

  const deleteLink = useCallback((id: string) => {
    setLinks((prev) => prev.filter((l) => l.id !== id));
  }, []);

  const toggleAuth = useCallback(() => {
    setIsAuthenticated((prev) => !prev);
  }, []);

  const totalClicks = links.reduce((sum, l) => sum + l.clicks, 0);

  return { url, setUrl, slug, setSlug, result, loading, shorten, isAuthenticated, toggleAuth, links, deleteLink, totalClicks, setResult, error, setError };
}
