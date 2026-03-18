"use client";

import { createPortal } from "react-dom";
import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Copy, Check, ExternalLink, X, Download, QrCode, Coffee } from "lucide-react";
import { toast } from "sonner";

interface TriggerProps {
  onClick: () => void;
}

export function DonationTrigger({ onClick }: TriggerProps) {
  return (
    <button
      onClick={onClick}
      className="cursor-pointer rounded-lg p-2 text-muted-foreground transition-colors hover:text-rose-400"
      aria-label="Support Me"
      type="button"
    >
      <Heart className="h-4 w-4" fill="currentColor" />
    </button>
  );
}

const PLATFORMS = [
  {
    name: "Trakteer",
    label: "trakteer.id/adsurkasur",
    href: "https://trakteer.id/adsurkasur",
    icon: <Heart className="h-5 w-5 text-primary" />,
  },
  {
    name: "Ko-fi",
    label: "ko-fi.com/adsurkasur",
    href: "https://ko-fi.com/adsurkasur",
    icon: <Coffee className="h-5 w-5 text-primary" />,
  },
];

const CRYPTO = [
  {
    name: "Bitcoin",
    address: "bc1q7d4t6ne3a44x2sujd5ektlngc9j0jfzhyn38z5",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5">
        <circle cx="12" cy="12" r="12" fill="#F7931A" />
        <path d="M17.27 10.25c.24-1.594-.976-2.452-2.638-3.023l.54-2.163-1.317-.328-.525 2.106c-.346-.087-.702-.168-1.056-.249l.53-2.12-1.317-.328-.54 2.163c-.286-.065-.567-.13-.84-.198l-1.816-.454-.35 1.407s.976.224.955.237c.533.133.63.486.614.766l-.615 2.465.137.046-.14-.034-.862 3.452c-.065.162-.23.405-.603.313l-.956-.239-.652 1.509 1.714.427c.319.08.631.163.94.242l-.546 2.19 1.316.328.54-2.165c.36.098.71.188 1.05.273l-.538 2.156 1.317.328.545-2.186c2.244.425 3.932.253 4.64-1.776.571-1.634-.028-2.576-1.208-3.192.86-.198 1.506-.764 1.678-1.932zm-3.005 4.213c-.406 1.63-3.15.749-4.04.528l.72-2.893c.89.222 3.746.662 3.32 2.365zm.405-4.237c-.37 1.48-2.654.728-3.395.544l.654-2.622c.74.184 3.128.528 2.741 2.078z" fill="white" />
      </svg>
    ),
  },
  {
    name: "EVM (ETH/BNB/etc)",
    address: "0xc53F031fe8cE7970D6Ff00fE65ef80617a893B44",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5">
        <path d="M11.944 17.97L4.58 13.62 11.943 24l7.37-10.38-7.372 4.35h.003z" fill="#627EEA" opacity=".6" />
        <path d="M12.056 0L4.69 12.223l7.365 4.354 7.365-4.35L12.056 0z" fill="#627EEA" />
        <path d="M11.944 17.97l-7.365-4.35 7.365 10.38V17.97z" fill="#627EEA" opacity=".2" />
        <path d="M12.056 24l7.365-10.38-7.365 4.35V24z" fill="#627EEA" opacity=".6" />
        <path d="M4.69 12.223L12.056 0v16.577l-7.365-4.354z" fill="#627EEA" opacity=".2" />
        <path d="M12.056 0l7.364 12.223-7.364 4.354V0z" fill="#627EEA" />
      </svg>
    ),
  },
  {
    name: "Solana",
    address: "3ymZGds5iphv4UNdSzv8DWaHeKGsCTe89sZwZMms2u9z",
    icon: (
      <svg viewBox="0 0 397 311" className="h-5 w-5" fill="none">
        <path d="M64.6 237.9a14 14 0 019.2-3.8h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7a14 14 0 01-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1l62.7-62.7z" fill="url(#sol-a)" />
        <path d="M64.6 3.8A14 14 0 0173.8 0h317.4c5.8 0 8.7 7 4.6 11.1L333.1 73.8a14 14 0 01-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1L64.6 3.8z" fill="url(#sol-b)" />
        <path d="M333.1 120.1a14 14 0 00-9.2-3.8H6.5c-5.8 0-8.7 7-4.6 11.1l62.7 62.7a14 14 0 009.2 3.8h317.4c5.8 0 8.7-7 4.6-11.1l-62.7-62.7z" fill="url(#sol-c)" />
        <defs>
          <linearGradient id="sol-a" x1="0" y1="155" x2="397" y2="155" gradientUnits="userSpaceOnUse">
            <stop stopColor="#00FFA3" />
            <stop offset="1" stopColor="#DC1FFF" />
          </linearGradient>
          <linearGradient id="sol-b" x1="0" y1="155" x2="397" y2="155" gradientUnits="userSpaceOnUse">
            <stop stopColor="#00FFA3" />
            <stop offset="1" stopColor="#DC1FFF" />
          </linearGradient>
          <linearGradient id="sol-c" x1="0" y1="155" x2="397" y2="155" gradientUnits="userSpaceOnUse">
            <stop stopColor="#00FFA3" />
            <stop offset="1" stopColor="#DC1FFF" />
          </linearGradient>
        </defs>
      </svg>
    ),
  },
  {
    name: "Sui",
    address: "0x232363195ab483e8721f995cc9dbfbf7573ac471a86e51c9a71538f82c86f5f6",
    icon: (
      <svg viewBox="0 0 300 383" className="h-5 w-5" fill="none">
        <path fill="#4DA2FF" fillRule="evenodd" d="M240 160c16 20 25 44 25 72s-10 53-26 72l-1 2-.5-2c-.3-2-.7-4-1-6-8-35-34-66-77-90-29-17-46-36-50-59-3-15-1-29 3-42s10-23 15-29l17-21c3-4 9-4 11 0L240 160zM267 139L154 2c-2-3-6-3-8 0L33 139l-.4.5C12 166 0 198 0 234c0 83 67 150 150 150s150-67 150-150c0-36-12-68-33-95zM60 160l10-12 .3 2c.2 2 .5 4 .9 5C78 190 101 218 140 240c34 19 53 41 59 66 2 10 3 20 2 29l-.1.5-.5.2C185 343 168 347 150 347c-64 0-115-51-115-115 0-28 10-53 25-72z" />
      </svg>
    ),
  },
];

function CryptoCard({ name, address, icon }: (typeof CRYPTO)[0]) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      toast.success("Address copied!");
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("Failed to copy address");
    }
  }, [address]);

  return (
    <motion.button
      type="button"
      onClick={handleCopy}
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.15 }}
      style={{ transformOrigin: "center" }}
      className="flex w-full cursor-pointer items-center gap-3 rounded-xl border border-border bg-card p-4 text-left transition-colors hover:border-primary/30 will-change-transform"
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-foreground">{name}</p>
        <p className="truncate text-xs text-muted-foreground">{address}</p>
      </div>
      <div className="shrink-0 text-muted-foreground">
        {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
      </div>
    </motion.button>
  );
}

function QrisModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [portalEl, setPortalEl] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setPortalEl(document.body);
  }, []);

  const handleDownload = useCallback(async () => {
    try {
      const res = await fetch("https://purple-given-lark-169.mypinata.cloud/ipfs/bafkreihplwmmtmq6youvqcfpiks4mffrdzc54h5ymqhfiq63bzzjfdiugq");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "qris-ade.jpg";
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      toast.error("Download failed");
    }
  }, []);

  if (!portalEl) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="qris-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-[70] bg-black/70 backdrop-blur-sm"
          />

          <motion.div
            key="qris-panel"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            className="fixed inset-0 z-[80] grid place-items-center p-4 pointer-events-none"
          >
            <div className="pointer-events-auto w-full max-w-[300px] rounded-2xl border border-border bg-card p-5 shadow-2xl">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
                    <QrCode className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <span className="text-sm font-semibold text-foreground">QRIS Payment</span>
                </div>
                <button
                  onClick={onClose}
                  className="cursor-pointer rounded-lg p-1.5 text-muted-foreground transition-colors hover:text-foreground"
                  type="button"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="overflow-hidden rounded-xl bg-white p-3">
                <img
                  src="https://purple-given-lark-169.mypinata.cloud/ipfs/bafkreihplwmmtmq6youvqcfpiks4mffrdzc54h5ymqhfiq63bzzjfdiugq"
                  alt="QRIS Payment Code"
                  className="h-auto w-full"
                />
              </div>

              <p className="mt-3 text-center text-xs text-muted-foreground">
                Scan with any Indonesian e-wallet or mobile banking
              </p>

              <button
                onClick={handleDownload}
                className="mt-4 flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
                type="button"
              >
                <Download className="h-4 w-4" />
                Download QRIS
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    portalEl
  );
}

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function DonationModal({ open, onClose }: Props) {
  const [qrisOpen, setQrisOpen] = useState(false);
  const [portalEl, setPortalEl] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setPortalEl(document.body);
  }, []);

  useEffect(() => {
    if (!open) setQrisOpen(false);
  }, [open]);

  if (!portalEl) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="donation-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          <motion.div
            key="donation-panel"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            className="fixed inset-0 z-[60] grid place-items-center p-4 pointer-events-none"
          >
            <div className="pointer-events-auto relative w-full max-w-md rounded-2xl border border-border bg-card shadow-2xl">
              <div className="flex items-center justify-between border-b border-border px-5 py-4">
                <div className="flex items-center gap-2">
                  <Heart className="h-4 w-4 text-rose-400" fill="currentColor" />
                  <span className="text-sm font-semibold text-foreground">Support Me</span>
                </div>
                <button
                  onClick={onClose}
                  className="cursor-pointer rounded-lg p-1.5 text-muted-foreground transition-colors hover:text-foreground"
                  type="button"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="max-h-[65vh] space-y-5 overflow-y-auto overflow-x-hidden px-5 py-4 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-border">
                <p className="text-sm text-muted-foreground">
                  If you enjoy this app, consider supporting its development. Every contribution helps keep it free and improving!
                </p>

                <div>
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Payment Platforms
                  </p>
                  <div className="space-y-2">
                    {PLATFORMS.map((p) => (
                      <motion.a
                        key={p.name}
                        href={p.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.01 }}
                        transition={{ duration: 0.15 }}
                        style={{ transformOrigin: "center" }}
                        className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/30 will-change-transform"
                      >
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                          {p.icon}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-foreground">{p.name}</p>
                          <p className="text-xs text-muted-foreground">{p.label}</p>
                        </div>
                        <ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground" />
                      </motion.a>
                    ))}

                    <motion.button
                      type="button"
                      onClick={() => setQrisOpen(true)}
                      whileHover={{ scale: 1.01 }}
                      transition={{ duration: 0.15 }}
                      style={{ transformOrigin: "center" }}
                      className="flex w-full cursor-pointer items-center gap-3 rounded-xl border border-border bg-card p-4 text-left transition-colors hover:border-primary/30 will-change-transform"
                    >
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                        <QrCode className="h-5 w-5 text-primary" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-foreground">QRIS</p>
                        <p className="text-xs text-muted-foreground">Scan to pay with any Indonesian e-wallet</p>
                      </div>
                      <ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground" />
                    </motion.button>
                  </div>
                </div>

                <div>
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Cryptocurrency
                  </p>
                  <div className="space-y-2">
                    {CRYPTO.map((c) => (
                      <CryptoCard key={c.name} {...c} />
                    ))}
                  </div>
                </div>

                <p className="pb-1 text-center text-xs text-muted-foreground">
                  Thank you for considering supporting this project! 🙏
                </p>
              </div>
            </div>
          </motion.div>

          <QrisModal open={qrisOpen} onClose={() => setQrisOpen(false)} />
        </>
      )}
    </AnimatePresence>,
    portalEl
  );
}
