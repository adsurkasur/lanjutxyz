"use client";

import { Copy, Trash2, Link as LinkIcon, MousePointerClick, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import type { LinkRecord } from "@/lib/api";

const shortBaseUrl =
  process.env.NEXT_PUBLIC_SHORT_BASE_URL ?? "https://arinahub.com/go/";
const shortBaseHostPath = shortBaseUrl.replace(/^https?:\/\//, "");

interface Props {
  links: LinkRecord[];
  totalClicks: number;
  onDelete: (id: string) => void;
}

export default function LinkTable({ links, totalClicks, onDelete }: Props) {
  const copyLink = (shortUrl: string) => {
    navigator.clipboard.writeText(`https://${shortUrl}`);
    toast.success("Copied to clipboard");
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Total Links", value: links.length, icon: LinkIcon },
          { label: "Total Clicks", value: totalClicks, icon: MousePointerClick },
          { label: "This Month", value: links.filter((l) => l.createdAt >= "2025-01").length, icon: Calendar },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="rounded-xl border border-border bg-card p-4 text-center card-glow"
          >
            <stat.icon className="mx-auto h-4 w-4 text-muted-foreground" />
            <p className="mt-2 text-2xl font-semibold text-foreground">{stat.value}</p>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Table */}
      <div>
        <h3 className="mb-3 text-sm font-medium text-foreground">My Links</h3>
        {links.length === 0 ? (
          <div className="flex flex-col items-center gap-2 rounded-xl border border-border bg-card p-12 card-glow">
            <LinkIcon className="h-8 w-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">No links yet. Create your first short link above.</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-border card-glow">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-secondary/50">
                  <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Short URL</th>
                  <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Original</th>
                  <th className="px-4 py-2.5 text-right font-medium text-muted-foreground">Clicks</th>
                  <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Created</th>
                  <th className="px-4 py-2.5 text-right font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {links.map((link) => (
                  <tr key={link.id} className="border-b border-border last:border-0">
                    <td className="px-4 py-2.5 font-mono text-xs text-primary">{link.shortUrl.replace(shortBaseHostPath, "/go/")}</td>
                    <td className="max-w-[180px] truncate px-4 py-2.5 text-muted-foreground">{link.originalUrl}</td>
                    <td className="px-4 py-2.5 text-right font-medium">{link.clicks}</td>
                    <td className="px-4 py-2.5 text-muted-foreground">{link.createdAt}</td>
                    <td className="px-4 py-2.5">
                      <div className="flex justify-end gap-1">
                        <button
                          onClick={() => copyLink(link.shortUrl)}
                          className="rounded p-1.5 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <Copy className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => onDelete(link.id)}
                          className="rounded p-1.5 text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
