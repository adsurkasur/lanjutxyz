"use client";

import { motion } from "framer-motion";
import { Github, Heart, Shield, Zap } from "lucide-react";
import { useState } from "react";
import { containerVariants, itemVariants, buttonHover, buttonTap, buttonTransition } from "@/lib/motion";
import DonationModal from "@/components/DonationModal";

export default function AboutPage() {
  const [donationOpen, setDonationOpen] = useState(false);

  return (
    <main className="flex flex-1 flex-col items-center px-4 py-16 sm:px-6 lg:px-8">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="mx-auto max-w-2xl space-y-16"
      >
        {/* Hero Section */}
        <motion.div variants={itemVariants} className="space-y-6 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            About Lanjut
          </h1>
          <p className="text-lg text-muted-foreground">
            Simple tools, serious results.
          </p>
        </motion.div>

        {/* Mission Statement */}
        <motion.div variants={itemVariants} className="rounded-2xl border border-border bg-card p-8 card-glow">
          <p className="text-base leading-relaxed text-foreground">
            Lanjut is a collection of focused digital tools designed to make your workflow simpler. 
            We believe that essential utilities like QR code generation and URL shortening should be 
            fast, reliable, and free from unnecessary complexity or intrusive tracking.
          </p>
        </motion.div>

        {/* Core Values */}
        <motion.div variants={itemVariants} className="grid gap-8 sm:grid-cols-2">
          <div className="space-y-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <Zap className="h-6 w-6 text-primary" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-foreground">Built for Speed</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Leveraging modern technologies to ensure your tools load instantly and perform at scale.
              </p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-foreground">Privacy Focused</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Your data belongs to you. We don&apos;t use intrusive tracking or sell your information.
              </p>
            </div>
          </div>
        </motion.div>

        {/* The Creator */}
        <motion.div variants={itemVariants} className="space-y-8 pt-8 border-t border-border text-center">
          <div className="space-y-3">
            <h2 className="text-2xl font-bold text-foreground">The Creator</h2>
            <p className="text-muted-foreground">
              Lanjut is an independent project crafted by{" "}
              <a
                href="https://github.com/adsurkasur"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-foreground underline decoration-border underline-offset-4 transition-colors hover:text-primary hover:decoration-primary"
              >
                adsurkasur
              </a>.
            </p>
          </div>
          <div className="flex justify-center">
            <motion.a
              href="https://github.com/adsurkasur"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={buttonHover}
              whileTap={buttonTap}
              transition={buttonTransition}
              className="flex items-center gap-2 rounded-xl border border-border bg-background px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
            >
              <Github className="h-4 w-4" />
              Follow on GitHub
            </motion.a>
          </div>
        </motion.div>

        {/* Support CTA */}
        <motion.div variants={itemVariants} className="text-center space-y-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 border border-primary/10 text-xs font-medium text-primary">
              <Heart className="h-3 w-3 fill-current" />
              Community Supported
            </div>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto">
              Lanjut is free to use. Your support helps keep the tools fast and ad-free for everyone.
            </p>
          </div>
          
          <motion.button
            onClick={() => setDonationOpen(true)}
            whileHover={buttonHover}
            whileTap={buttonTap}
            transition={buttonTransition}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            <Heart className="h-4 w-4" />
            Support Lanjut
          </motion.button>
        </motion.div>
      </motion.div>

      <DonationModal open={donationOpen} onClose={() => setDonationOpen(false)} />
    </main>
  );
}
