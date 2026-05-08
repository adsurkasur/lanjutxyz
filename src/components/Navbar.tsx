"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Info, Link as LinkIcon, LogIn, LogOut, Moon, QrCode, Sun } from "lucide-react";
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
    { href: "/", label: "Home", icon: Home },
    { href: "/qr", label: "QR", icon: QrCode },
    { href: "/short", label: "Shortener", icon: LinkIcon },
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
        <Link href="/" className="flex items-center">
          <motion.img
            src="/logo.png"
            alt="Lanjut Tools"
            className="h-10 w-auto"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          />
        </Link>

        <div className="flex min-w-0 items-center gap-0.5 sm:gap-1">
          <div className="flex items-center gap-0.5 sm:hidden">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-lg p-2 transition-colors ${
                    isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                  aria-label={item.label}
                >
                  <item.icon className="h-4 w-4" />
                </Link>
              );
            })}
          </div>

          <div className="hidden items-center gap-1 sm:flex">
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
          </div>

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
          
          <Link href="/about">
            <motion.button
              whileHover={{ ...buttonHover, color: "#3b82f6" }}
              whileTap={buttonTap}
              transition={buttonTransition}
              className="cursor-pointer rounded-lg p-2 text-muted-foreground transition-colors hover:text-blue-500"
              aria-label="About"
            >
              <Info className="h-4 w-4" />
            </motion.button>
          </Link>

          {user ? (
            <>
              <span className="hidden truncate px-2 text-sm text-muted-foreground sm:block sm:max-w-[200px] md:max-w-[300px] lg:max-w-[400px]">
                {user.email}
              </span>
              <motion.button
                whileHover={buttonHover}
                whileTap={buttonTap}
                transition={buttonTransition}
                onClick={() => {
                  void signOut();
                }}
                className="rounded-lg p-2 text-muted-foreground transition-colors hover:text-foreground sm:hidden"
                aria-label="Sign Out"
              >
                <LogOut className="h-4 w-4" />
              </motion.button>
              <motion.button
                whileHover={buttonHover}
                whileTap={buttonTap}
                transition={buttonTransition}
                onClick={() => {
                  void signOut();
                }}
                className="hidden rounded-lg px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground sm:block"
              >
                Sign Out
              </motion.button>
            </>
          ) : (
            <>
              <motion.button
                whileHover={buttonHover}
                whileTap={buttonTap}
                transition={buttonTransition}
                onClick={() => setAuthOpen(true)}
                className="rounded-lg p-2 text-muted-foreground transition-colors hover:text-foreground sm:hidden"
                aria-label="Sign In"
              >
                <LogIn className="h-4 w-4" />
              </motion.button>
              <motion.button
                whileHover={buttonHover}
                whileTap={buttonTap}
                transition={buttonTransition}
                onClick={() => setAuthOpen(true)}
                className="hidden rounded-lg px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground sm:block"
              >
                Sign In
              </motion.button>
            </>
          )}
        </div>
      </div>

      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
      <DonationModal open={donationOpen} onClose={() => setDonationOpen(false)} />
    </motion.nav>
  );
}
