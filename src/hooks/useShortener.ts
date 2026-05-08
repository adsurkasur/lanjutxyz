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

export interface UILinkRecord extends LinkRecord {
  isLocal?: boolean;
}

export function useShortener() {
  const { user } = useAuth();
  const [url, setUrl] = useState("");
  const [slug, setSlug] = useState("");
  const [result, setResult] = useState<ShortenResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [links, setLinks] = useState<UILinkRecord[]>([]);

  const isAuthenticated = !!user;

  const loadLinks = useCallback(async () => {
    // 1. Load Local Links
    const stored = localStorage.getItem("lanjut_anon_links");
    let localLinks: UILinkRecord[] = [];
    if (stored) {
      try {
        localLinks = (JSON.parse(stored) as LinkRecord[]).map(l => ({ ...l, isLocal: true }));
      } catch (err) {
        console.error("Failed to parse local links:", err);
      }
    }

    // 2. Load Account Links
    let accountLinks: UILinkRecord[] = [];
    if (user) {
      try {
        const fetched = await fetchUserLinks(user.id);
        accountLinks = fetched.map(l => ({ ...l, isLocal: false }));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load account links");
      }
    }

    // Combine them (Account links first)
    const combined = [...accountLinks, ...localLinks];
    setLinks(combined);

    // 3. Refresh click counts for local links
    if (localLinks.length > 0) {
      const ids = localLinks.map(l => l.id).filter(id => !id.startsWith("temp-"));
      if (ids.length > 0) {
        try {
          const updated = await fetchLinksByIds(ids);
          setLinks(prev => {
            const merged = prev.map(p => {
              if (!p.isLocal) return p;
              const u = updated.find(up => up.id === p.id);
              return u ? { ...u, isLocal: true } : p;
            });
            
            // Save refreshed local links back to storage
            const localOnly = merged.filter(m => m.isLocal);
            localStorage.setItem("lanjut_anon_links", JSON.stringify(localOnly));
            
            return merged;
          });
        } catch (err) {
          console.error("Failed to refresh local clicks:", err);
        }
      }
    }
  }, [user]);

  useEffect(() => {
    void loadLinks();
  }, [loadLinks]);

  // Real-time click updates
  useEffect(() => {
    const userFilter = user ? `user_id = "${user.id}"` : "";
    const localIds = links.filter(l => l.isLocal && !l.id.startsWith("temp-")).map(l => l.id);
    const localFilter = localIds.length > 0 ? localIds.map(id => `id = "${id}"`).join(" || ") : "";

    let filter = "";
    if (userFilter && localFilter) {
      filter = `(${userFilter}) || (${localFilter})`;
    } else {
      filter = userFilter || localFilter;
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
              
              // Sync local updates back to storage
              const localOnly = updated.filter(u => u.isLocal);
              if (localOnly.length > 0) {
                localStorage.setItem("lanjut_anon_links", JSON.stringify(localOnly));
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
  }, [user, links.length]);

  const shorten = useCallback(async () => {
    if (!url.trim()) return;
    setLoading(true);

    try {
      setError(null);
      const res = await shortenUrl({ url, slug: slug || undefined });
      setResult(res);

      if (user) {
        // If logged in, we refresh the full list to include the new account link
        await loadLinks();
      } else {
        // If anonymous, we just add to the local list
        const newRecord: UILinkRecord = {
          id: res.id || `temp-${Date.now()}`,
          shortUrl: res.shortUrl,
          originalUrl: res.originalUrl,
          clicks: 0,
          createdAt: new Date().toISOString().split("T")[0],
          isLocal: true,
        };
        setLinks((prev) => {
          const updated = [newRecord, ...prev];
          localStorage.setItem("lanjut_anon_links", JSON.stringify(updated.filter(l => l.isLocal)));
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
        // Always try to delete from API if it has a real ID
        if (!id.startsWith("temp-")) {
          await deleteLinkApi(id);
        }
        
        // If it was local, update localStorage
        if (existing.isLocal) {
          const stored = localStorage.getItem("lanjut_anon_links");
          if (stored) {
            const localLinks = JSON.parse(stored) as LinkRecord[];
            const updated = localLinks.filter(l => l.id !== id);
            localStorage.setItem("lanjut_anon_links", JSON.stringify(updated));
          }
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
