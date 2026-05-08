"use client";

import { useState, useCallback, useEffect } from "react";
import {
  shortenUrl,
  fetchUserLinks,
  fetchLinksByIds,
  deleteLink as deleteLinkApi,
  type ShortenResponse,
  type LinkRecord,
} from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { pb } from "@/lib/pocketbase";

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
    if (user) {
      try {
        const fetched = await fetchUserLinks(user.id);
        setLinks(fetched);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load links");
      }
    } else {
      // Load from localStorage for anonymous users
      const stored = localStorage.getItem("lanjut_anon_links");
      if (stored) {
        try {
          const localLinks = JSON.parse(stored) as LinkRecord[];
          setLinks(localLinks);
          
          // Refresh click counts from server
          if (localLinks.length > 0) {
            const ids = localLinks.map(l => l.id).filter(id => !id.startsWith("temp-"));
            if (ids.length > 0) {
              const updated = await fetchLinksByIds(ids);
              // Merge updated data with existing local links (to preserve temporary ones if any)
              setLinks(prev => {
                const merged = prev.map(p => {
                  const u = updated.find(up => up.id === p.id);
                  return u ? u : p;
                });
                localStorage.setItem("lanjut_anon_links", JSON.stringify(merged));
                return merged;
              });
            }
          }
        } catch (err) {
          console.error("Failed to parse local links:", err);
          setLinks([]);
        }
      } else {
        setLinks([]);
      }
    }
  }, [user]);

  useEffect(() => {
    void loadLinks();
  }, [loadLinks]);

  // Real-time click updates
  useEffect(() => {
    let filter = "";
    if (user) {
      filter = `user_id = "${user.id}"`;
    } else if (links.length > 0) {
      const ids = links.map(l => l.id).filter(id => !id.startsWith("temp-"));
      if (ids.length > 0) {
        filter = ids.map(id => `id = "${id}"`).join(" || ");
      }
    }

    if (!filter) return;

    const subscribe = async () => {
      try {
        await pb.collection("links").subscribe("*", (e) => {
          if (e.action === "update") {
            setLinks((prev) => {
              const updated = prev.map((l) => {
                if (l.id === e.record.id) {
                  return {
                    ...l,
                    clicks: e.record.click_count ?? 0,
                  };
                }
                return l;
              });
              
              if (!user) {
                localStorage.setItem("lanjut_anon_links", JSON.stringify(updated));
              }
              
              return updated;
            });
          }
        }, { filter });
      } catch (err) {
        console.error("Real-time subscription error:", err);
      }
    };

    void subscribe();

    return () => {
      void pb.collection("links").unsubscribe("*");
    };
  }, [user, links.length]); // Re-subscribe if list length changes (to update filters for anon users)

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
        const newRecord: LinkRecord = {
          id: res.id || `temp-${Date.now()}`,
          shortUrl: res.shortUrl,
          originalUrl: res.originalUrl,
          clicks: 0,
          createdAt: new Date().toISOString().split("T")[0],
        };
        setLinks((prev) => {
          const updated = [newRecord, ...prev];
          localStorage.setItem("lanjut_anon_links", JSON.stringify(updated));
          return updated;
        });
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
        if (!user) {
          const updated = links.filter((l) => l.id !== id);
          localStorage.setItem("lanjut_anon_links", JSON.stringify(updated));
        }
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
