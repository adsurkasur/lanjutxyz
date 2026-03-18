"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import QRSingle from "@/components/QRSingle";
import QRBulk from "@/components/QRBulk";
import { pageVariants, EASE } from "@/lib/motion";

const tabs = ["Single", "Bulk"] as const;

export default function QRPage() {
  const [tab, setTab] = useState<(typeof tabs)[number]>("Single");

  return (
    <motion.main
      initial={pageVariants.initial}
      animate={pageVariants.animate}
      transition={pageVariants.transition}
      className="flex-1 px-4 py-6 sm:px-6 sm:py-10 lg:px-8"
    >
      <div className="mx-auto max-w-tool">
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">QR Code Generator</h1>
        <p className="mt-1 text-sm text-muted-foreground">Generate QR codes from text or URLs.</p>

        <div className="relative mt-8 flex gap-1 rounded-lg bg-secondary p-1">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="relative z-10 flex-1 rounded-md px-4 py-2.5 text-sm font-medium transition-colors sm:py-2"
              style={{ color: tab === t ? "hsl(var(--foreground))" : "hsl(var(--muted-foreground))" }}
            >
              {t}
              {tab === t && (
                <motion.div
                  layoutId="qr-tab-indicator"
                  className="absolute inset-0 rounded-md bg-card shadow-sm"
                  style={{ zIndex: -1 }}
                  transition={EASE.spring}
                />
              )}
            </button>
          ))}
        </div>

        <div className="mt-8">{tab === "Single" ? <QRSingle /> : <QRBulk />}</div>
      </div>
    </motion.main>
  );
}