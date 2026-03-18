"use client";

import { useState, useCallback, useEffect } from "react";
import {
  shortenUrl,
  fetchUserLinks,
  deleteLink as deleteLinkApi,
  type ShortenResponse,
  type LinkRecord,
} from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";

export function useShortener() {
  const { user } = useAuth();
  const [url, setUrl] = useState("");
  const [slug, setSlug] = useState("");
  const [result, setResult] = useState<ShortenResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [links, setLinks] = useState<LinkRecord[]>([]);

  const isAuthenticated = !!user;

  const loadLinks = useCallback(async () => {
    if (!user) {
      setLinks([]);
      return;
    }

    try {
      const fetched = await fetchUserLinks(user.id);
      setLinks(fetched);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load links");
    }
  }, [user]);

  useEffect(() => {
    void loadLinks();
  }, [loadLinks]);

  const shorten = useCallback(async () => {
    if (!url.trim()) return;
    setLoading(true);

    try {
      setError(null);
      const res = await shortenUrl({ url, slug: slug || undefined });
      setResult(res);

      if (user) {
        await loadLinks();
      } else {
        setLinks((prev) => [
          {
            id: String(Date.now()),
            shortUrl: res.shortUrl,
            originalUrl: res.originalUrl,
            clicks: 0,
            createdAt: new Date().toISOString().split("T")[0],
          },
          ...prev,
        ]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [url, slug, user, loadLinks]);

  const deleteLink = useCallback(
    async (id: string) => {
      const existing = links.find((l) => l.id === id);
      if (!existing) return;

      setLinks((prev) => prev.filter((l) => l.id !== id));

      try {
        await deleteLinkApi(id);
      } catch (err) {
        setLinks((prev) => [existing, ...prev]);
        setError(err instanceof Error ? err.message : "Failed to delete link");
      }
    },
    [links]
  );

  const totalClicks = links.reduce((sum, l) => sum + l.clicks, 0);

  return {
    url,
    setUrl,
    slug,
    setSlug,
    result,
    loading,
    shorten,
    isAuthenticated,
    links,
    deleteLink,
    totalClicks,
    setResult,
    error,
    setError,
  };
}
