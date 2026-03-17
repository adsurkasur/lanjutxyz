import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import QRSingle from "@/components/QRSingle";
import QRBulk from "@/components/QRBulk";

const tabs = ["Single", "Bulk"] as const;

export default function QRTool() {
  const [tab, setTab] = useState<(typeof tabs)[number]>("Single");

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <motion.main
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="flex-1 px-4 py-10 sm:px-6 lg:px-8"
      >
        <div className="mx-auto max-w-tool">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">QR Code Generator</h1>
          <p className="mt-1 text-sm text-muted-foreground">Generate QR codes from text or URLs.</p>

          {/* Tabs */}
          <div className="relative mt-8 flex gap-1 rounded-lg bg-secondary p-1">
            {tabs.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className="relative z-10 flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors"
                style={{ color: tab === t ? "hsl(var(--foreground))" : "hsl(var(--muted-foreground))" }}
              >
                {t}
                {tab === t && (
                  <motion.div
                    layoutId="qr-tab-indicator"
                    className="absolute inset-0 rounded-md bg-card shadow-sm"
                    style={{ zIndex: -1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>

          <div className="mt-8">
            {tab === "Single" ? <QRSingle /> : <QRBulk />}
          </div>
        </div>
      </motion.main>

      <Footer />
    </div>
  );
}
