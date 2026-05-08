"use client";

import { Copy, Trash2, Link as LinkIcon, MousePointerClick, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import type { LinkRecord } from "@/lib/api";
import { itemVariants } from "@/lib/motion";

interface Props {
  links: LinkRecord[];
  totalClicks: number;
  onDelete: (id: string) => void;
  isAuthenticated?: boolean;
}

export default function LinkTable({ links, totalClicks, onDelete, isAuthenticated }: Props) {
  const thisMonth = new Date().toISOString().slice(0, 7);

  const copyLink = (shortUrl: string) => {
    navigator.clipboard.writeText(shortUrl);
    toast.success("Copied to clipboard");
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {[
          { label: "Total Links", value: links.length, icon: LinkIcon },
          { label: "Total Clicks", value: totalClicks, icon: MousePointerClick },
          { label: "This Month", value: links.filter((l) => l.createdAt >= thisMonth).length, icon: Calendar },
        ].map((stat) => (
          <motion.div
            key={stat.label}
            variants={itemVariants}
            initial="hidden"
            animate="show"
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
          <div className="flex flex-col items-center gap-2 rounded-xl border border-border bg-card p-12 card-glow text-center">
            <LinkIcon className="h-8 w-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground max-w-[250px]">
              {isAuthenticated 
                ? "No links in your account yet. Create your first short link above." 
                : "No links created in this browser yet."}
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-2 md:hidden">
              {links.map((link) => (
                <div key={link.id} className="rounded-xl border border-border bg-card p-3 card-glow">
                  <a
                    href={link.shortUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block truncate font-mono text-xs text-primary transition-colors hover:text-primary/80 hover:underline"
                  >
                    {link.shortUrl}
                  </a>
                  <p className="mt-1 truncate text-xs text-muted-foreground">{link.originalUrl}</p>
                  <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                    <span>{link.clicks} clicks</span>
                    <span>{link.createdAt}</span>
                  </div>
                  <div className="mt-3 flex justify-end gap-1">
                    <button
                      onClick={() => copyLink(link.shortUrl)}
                      className="cursor-pointer rounded p-1.5 text-muted-foreground transition-colors hover:text-foreground"
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => onDelete(link.id)}
                      className="cursor-pointer rounded p-1.5 text-muted-foreground transition-colors hover:text-destructive"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="hidden overflow-x-auto rounded-xl border border-border card-glow md:block">
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
                      <td className="px-4 py-2.5">
                        <a
                          href={link.shortUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-mono text-xs text-primary transition-colors hover:text-primary/80 hover:underline"
                        >
                          {link.shortUrl}
                        </a>
                      </td>
                      <td className="max-w-[180px] truncate px-4 py-2.5 text-muted-foreground">{link.originalUrl}</td>
                      <td className="px-4 py-2.5 text-right font-medium">{link.clicks}</td>
                      <td className="px-4 py-2.5 text-muted-foreground">{link.createdAt}</td>
                      <td className="px-4 py-2.5">
                        <div className="flex justify-end gap-1">
                          <button
                            onClick={() => copyLink(link.shortUrl)}
                            className="cursor-pointer rounded p-1.5 text-muted-foreground transition-colors hover:text-foreground"
                          >
                            <Copy className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => onDelete(link.id)}
                            className="cursor-pointer rounded p-1.5 text-muted-foreground transition-colors hover:text-destructive"
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
          </>
        )}
      </div>
    </div>
  );
}
