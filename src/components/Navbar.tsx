"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AuthModal from "@/components/AuthModal";
import DonationModal, { DonationTrigger } from "@/components/DonationModal";
import { useAuth } from "@/hooks/useAuth";
import { buttonHover, buttonTap, buttonTransition, pageVariants } from "@/lib/motion";

export default function Navbar() {
  const [dark, setDark] = useState(true);
  const [authOpen, setAuthOpen] = useState(false);
  const [donationOpen, setDonationOpen] = useState(false);
  const pathname = usePathname();
  const { user, signOut } = useAuth();

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/qr", label: "QR" },
    { href: "/short", label: "Shortener" },
  ];

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  // Set dark mode on mount
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  return (
    <motion.nav
      initial={pageVariants.initial}
      animate={pageVariants.animate}
      transition={pageVariants.transition}
      className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md"
    >
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
            <span className="text-xs font-bold text-primary-foreground">A</span>
          </div>
          <span className="text-sm font-semibold tracking-tight text-foreground">Arina Tools</span>
        </Link>

        <div className="flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-lg px-3 py-1.5 text-sm transition-colors ${
                  isActive ? "font-medium text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          <motion.button
            whileHover={buttonHover}
            whileTap={buttonTap}
            transition={buttonTransition}
            onClick={() => setDark(!dark)}
            className="rounded-lg p-2 text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Toggle theme"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={dark ? "sun" : "moon"}
                initial={{ opacity: 0, rotate: -30, scale: 0.7 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: 30, scale: 0.7 }}
                transition={{ duration: 0.2 }}
              >
                {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </motion.div>
            </AnimatePresence>
          </motion.button>

          <DonationTrigger onClick={() => setDonationOpen(true)} />

          {user ? (
            <>
              <span className="max-w-[180px] truncate px-2 text-sm text-muted-foreground">
                {user.email?.slice(0, 20)}
              </span>
              <motion.button
                whileHover={buttonHover}
                whileTap={buttonTap}
                transition={buttonTransition}
                onClick={() => {
                  void signOut();
                }}
                className="rounded-lg px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Sign Out
              </motion.button>
            </>
          ) : (
            <motion.button
              whileHover={buttonHover}
              whileTap={buttonTap}
              transition={buttonTransition}
              onClick={() => setAuthOpen(true)}
              className="rounded-lg px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Sign In
            </motion.button>
          )}
        </div>
      </div>

      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
      <DonationModal open={donationOpen} onClose={() => setDonationOpen(false)} />
    </motion.nav>
  );
}
