"use client";

import * as Dialog from "@radix-ui/react-dialog";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { motion } from "framer-motion";
import { Check, Coffee, Copy, ExternalLink, Heart, QrCode, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { toast } from "sonner";

type DonationModalProps = {
  open: boolean;
  onClose: () => void;
};

type DonationTriggerProps = {
  onClick: () => void;
};

type PaymentPlatform = {
  name: string;
  label: string;
  href: string;
  icon: ReactNode;
};

type CryptoItem = {
  key: string;
  name: string;
  address: string;
  icon: ReactNode;
};

const qrisImageUrl =
  "https://purple-given-lark-169.mypinata.cloud/ipfs/bafkreihplwmmtmq6youvqcfpiks4mffrdzc54h5ymqhfiq63bzzjfdiugq";

const CLOSE_DURATION_MS = 220;

const paymentPlatforms: PaymentPlatform[] = [
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

function BitcoinIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
      <path d="M23.638 14.904c-1.602 6.43-8.113 10.34-14.542 8.736C2.67 22.05-1.244 15.525.362 9.105 1.962 2.67 8.475-1.243 14.9.358c6.43 1.605 10.342 8.115 8.738 14.546z" fill="#F7931A" />
      <path d="M17.27 10.25c.24-1.594-.976-2.452-2.638-3.023l.54-2.163-1.317-.328-.525 2.106c-.346-.087-.702-.168-1.056-.249l.53-2.12-1.317-.328-.54 2.163c-.286-.065-.567-.13-.84-.198l.001-.006-1.816-.454-.35 1.407s.976.224.955.237c.533.133.63.486.614.766l-.615 2.465c.037.01.084.024.137.046l-.14-.034-.862 3.452c-.065.162-.23.405-.603.313.013.02-.956-.239-.956-.239l-.652 1.509 1.714.427c.319.08.631.163.94.242l-.546 2.19 1.316.328.54-2.165c.36.098.71.188 1.05.273l-.538 2.156 1.317.328.545-2.186c2.244.425 3.932.253 4.64-1.776.571-1.634-.028-2.576-1.208-3.192.86-.198 1.506-.764 1.678-1.932zm-3.005 4.213c-.406 1.63-3.15.749-4.04.528l.72-2.893c.89.222 3.746.662 3.32 2.365zm.405-4.237c-.37 1.48-2.654.728-3.395.544l.654-2.622c.74.184 3.128.528 2.741 2.078z" fill="white" />
    </svg>
  );
}

function EvmIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
      <path d="M11.944 17.97L4.58 13.62 11.943 24l7.37-10.38-7.372 4.35h.003z" fill="#627EEA" opacity=".6" />
      <path d="M12.056 0L4.69 12.223l7.365 4.354 7.365-4.35L12.056 0z" fill="#627EEA" />
      <path d="M11.944 17.97l-7.365-4.35 7.365 10.38V17.97z" fill="#627EEA" opacity=".2" />
      <path d="M12.056 24l7.365-10.38-7.365 4.35V24z" fill="#627EEA" opacity=".6" />
      <path d="M4.69 12.223L12.056 0v16.577l-7.365-4.354z" fill="#627EEA" opacity=".2" />
      <path d="M12.056 0l7.364 12.223-7.364 4.354V0z" fill="#627EEA" />
    </svg>
  );
}

function SolanaIcon() {
  return (
    <svg viewBox="0 0 397 311" className="h-5 w-5" fill="none" aria-hidden="true">
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
  );
}

function SuiIcon() {
  return (
    <svg viewBox="0 0 300 383" className="h-5 w-5" fill="none" aria-hidden="true">
      <path fill="#4DA2FF" fillRule="evenodd" d="M240 160c16 20 25 44 25 72s-10 53-26 72l-1 2-.5-2c-.3-2-.7-4-1-6-8-35-34-66-77-90-29-17-46-36-50-59-3-15-1-29 3-42s10-23 15-29l17-21c3-4 9-4 11 0L240 160zM267 139L154 2c-2-3-6-3-8 0L33 139l-.4.5C12 166 0 198 0 234c0 83 67 150 150 150s150-67 150-150c0-36-12-68-33-95zM60 160l10-12 .3 2c.2 2 .5 4 .9 5C78 190 101 218 140 240c34 19 53 41 59 66 2 10 3 20 2 29l-.1.5-.5.2C185 343 168 347 150 347c-64 0-115-51-115-115 0-28 10-53 25-72z" />
    </svg>
  );
}

export function DonationTrigger({ onClick }: DonationTriggerProps) {
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

export default function DonationModal({ open, onClose }: DonationModalProps) {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [qrisOpen, setQrisOpen] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const closeTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (open) {
      setMounted(true);
      const frame = window.requestAnimationFrame(() => setVisible(true));
      return () => window.cancelAnimationFrame(frame);
    }

    setVisible(false);
    const timer = window.setTimeout(() => {
      setMounted(false);
      setQrisOpen(false);
    }, CLOSE_DURATION_MS);

    return () => window.clearTimeout(timer);
  }, [open]);

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) {
        window.clearTimeout(closeTimerRef.current);
      }
    };
  }, []);

  const cryptoItems = useMemo<CryptoItem[]>(
    () => [
      {
        key: "btc",
        name: "Bitcoin",
        address: "bc1q7d4t6ne3a44x2sujd5ektlngc9j0jfzhyn38z5",
        icon: <BitcoinIcon />,
      },
      {
        key: "evm",
        name: "EVM (ETH/BNB/etc)",
        address: "0xc53F031fe8cE7970D6Ff00fE65ef80617a893B44",
        icon: <EvmIcon />,
      },
      {
        key: "sol",
        name: "Solana",
        address: "3ymZGds5iphv4UNdSzv8DWaHeKGsCTe89sZwZMms2u9z",
        icon: <SolanaIcon />,
      },
      {
        key: "sui",
        name: "Sui",
        address: "0x232363195ab483e8721f995cc9dbfbf7573ac471a86e51c9a71538f82c86f5f6",
        icon: <SuiIcon />,
      },
    ],
    []
  );

  const copyAddress = async (item: CryptoItem) => {
    try {
      await navigator.clipboard.writeText(item.address);
      setCopiedKey(item.key);
      toast.success("Address copied!");
      window.setTimeout(() => {
        setCopiedKey((current) => (current === item.key ? null : current));
      }, 1500);
    } catch {
      toast.error("Failed to copy address");
    }
  };

  const downloadQris = async () => {
    try {
      const response = await fetch(qrisImageUrl);
      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = objectUrl;
      anchor.download = "qris-ade.jpg";
      anchor.click();
      URL.revokeObjectURL(objectUrl);
    } catch {
      toast.error("Failed to download QRIS image");
    }
  };

  const handleClose = useCallback(() => {
    if (!mounted) return;
    setVisible(false);
    setQrisOpen(false);

    if (closeTimerRef.current) {
      window.clearTimeout(closeTimerRef.current);
    }

    closeTimerRef.current = window.setTimeout(() => {
      onClose();
      closeTimerRef.current = null;
    }, CLOSE_DURATION_MS);
  }, [mounted, onClose]);

  if (!mounted) return null;

  return (
    <Dialog.Root
      open={mounted}
      onOpenChange={(next) => {
        if (!next) handleClose();
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay asChild>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: visible ? 1 : 0 }}
            transition={{ duration: 0.2 }}
            onClick={handleClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />
        </Dialog.Overlay>

        <Dialog.Content className="fixed inset-0 z-[60] grid place-items-center p-4">
          <VisuallyHidden.Root>
            <Dialog.Title>Support Me</Dialog.Title>
          </VisuallyHidden.Root>

          <motion.div
            key="donation-modal"
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: visible ? 1 : 0, scale: visible ? 1 : 0.95, y: visible ? 0 : 8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            onClick={(event) => event.stopPropagation()}
            className="pointer-events-auto relative w-full max-w-md rounded-2xl border border-border bg-card shadow-2xl"
          >
                <div className="mb-4 flex items-center justify-between p-5 pb-0">
                  <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                    <Heart className="h-4 w-4 text-rose-400" fill="currentColor" />
                    Support Me
                  </div>
                  <Dialog.Close asChild>
                    <button
                      className="rounded-lg p-1 text-muted-foreground transition-colors hover:text-foreground"
                      aria-label="Close donation modal"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </Dialog.Close>
                </div>

                <div className="max-h-[70vh] space-y-6 overflow-y-auto overflow-x-hidden p-5 pt-0 pr-4">
                  <section>
                    <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Payment Platforms
                    </h3>
                    <div className="space-y-3">
                      {paymentPlatforms.map((platform) => (
                        <motion.a
                          key={platform.name}
                          whileHover={{ scale: 1.01 }}
                          transition={{ duration: 0.15 }}
                          style={{ transformOrigin: "center" }}
                          href={platform.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="will-change-transform flex items-center justify-between rounded-xl border border-border bg-card p-4 card-glow"
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                              {platform.icon}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-foreground">{platform.name}</p>
                              <p className="text-xs text-muted-foreground">{platform.label}</p>
                            </div>
                          </div>
                          <ExternalLink className="h-4 w-4 text-muted-foreground" />
                        </motion.a>
                      ))}

                      <Dialog.Root
                        open={qrisOpen}
                        onOpenChange={setQrisOpen}
                      >
                        <Dialog.Trigger asChild>
                          <motion.button
                            whileHover={{ scale: 1.01 }}
                            transition={{ duration: 0.15 }}
                            style={{ transformOrigin: "center" }}
                            type="button"
                            className="will-change-transform cursor-pointer flex w-full items-center justify-between rounded-xl border border-border bg-card p-4 text-left card-glow"
                          >
                            <div className="flex items-center gap-3">
                              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                                <QrCode className="h-5 w-5 text-primary" />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-foreground">QRIS</p>
                                <p className="text-xs text-muted-foreground">Scan to pay with any Indonesian e-wallet</p>
                              </div>
                            </div>
                            <ExternalLink className="h-4 w-4 text-muted-foreground" />
                          </motion.button>
                        </Dialog.Trigger>

                        <Dialog.Portal>
                          <Dialog.Overlay forceMount asChild>
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: qrisOpen ? 1 : 0 }}
                              transition={{ duration: 0.2 }}
                              className={`fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm ${qrisOpen ? "pointer-events-auto" : "pointer-events-none"}`}
                            />
                          </Dialog.Overlay>
                          <Dialog.Content forceMount asChild>
                            <motion.div
                              initial={{ opacity: 0, scale: 0.96, y: 10 }}
                              animate={{ opacity: qrisOpen ? 1 : 0, scale: qrisOpen ? 1 : 0.96, y: qrisOpen ? 0 : 10 }}
                              transition={{ duration: 0.2, ease: "easeOut" }}
                              className={`fixed left-1/2 top-1/2 z-[80] w-[92vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-border bg-card p-5 sm:p-6 card-glow ${qrisOpen ? "pointer-events-auto" : "pointer-events-none"}`}
                            >
                            <VisuallyHidden.Root>
                              <Dialog.Title>QRIS</Dialog.Title>
                            </VisuallyHidden.Root>

                            <div className="mb-4 flex items-center justify-between">
                              <Dialog.Title className="text-base font-semibold text-foreground">QRIS Payment</Dialog.Title>
                              <Dialog.Close asChild>
                                <button
                                  className="rounded-lg p-1 text-muted-foreground transition-colors hover:text-foreground"
                                  aria-label="Close QRIS modal"
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              </Dialog.Close>
                            </div>
                            <div className="space-y-4">
                              <div className="rounded-xl border border-border bg-secondary/30 p-2">
                                <img
                                  src={qrisImageUrl}
                                  alt="QRIS payment code"
                                  className="w-full rounded-lg border border-border"
                                />
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  void downloadQris();
                                }}
                                className="w-full rounded-lg bg-primary px-4 py-3 text-sm font-medium text-primary-foreground"
                              >
                                Download QRIS Image
                              </button>
                            </div>
                            </motion.div>
                          </Dialog.Content>
                        </Dialog.Portal>
                      </Dialog.Root>
                    </div>
                  </section>

                  <section>
                    <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Cryptocurrency
                    </h3>
                    <div className="space-y-3">
                      {cryptoItems.map((item) => {
                        const copied = copiedKey === item.key;
                        return (
                          <motion.div
                            key={item.key}
                            whileHover={{ scale: 1.01 }}
                            transition={{ duration: 0.15 }}
                            style={{ transformOrigin: "center" }}
                            role="button"
                            tabIndex={0}
                            onClick={() => {
                              void copyAddress(item);
                            }}
                            onKeyDown={(event) => {
                              if (event.key === "Enter" || event.key === " ") {
                                event.preventDefault();
                                void copyAddress(item);
                              }
                            }}
                            className="will-change-transform cursor-pointer flex items-center justify-between rounded-xl border border-border bg-card p-4 text-left card-glow"
                          >
                            <div className="flex items-center gap-3">
                              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                                {item.icon}
                              </div>
                              <div>
                                <p className="text-sm font-medium text-foreground">{item.name}</p>
                                <p className="max-w-[210px] truncate text-xs text-muted-foreground">{item.address}</p>
                              </div>
                            </div>

                            <span className="cursor-pointer">
                              {copied ? (
                                <Check className="h-4 w-4 text-primary" />
                              ) : (
                                <Copy className="h-4 w-4 text-muted-foreground" />
                              )}
                            </span>
                          </motion.div>
                        );
                      })}
                    </div>
                  </section>

                  <p className="text-center text-xs text-muted-foreground">
                    Thank you for considering supporting this project! 🙏
                  </p>
                </div>
          </motion.div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
