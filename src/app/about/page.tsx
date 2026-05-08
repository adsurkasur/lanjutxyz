"use client";

import { motion } from "framer-motion";
import { Github, Heart, Shield, Zap } from "lucide-react";
import { containerVariants, itemVariants } from "@/lib/motion";

export default function AboutPage() {
  return (
    <main className="flex flex-1 flex-col items-center px-4 py-12 sm:px-6 lg:px-8">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="mx-auto max-w-2xl space-y-12"
      >
        {/* Hero Section */}
        <motion.div variants={itemVariants} className="space-y-4 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            About Lanjut
          </h1>
          <p className="text-lg text-muted-foreground">
            Simple tools, serious results.
          </p>
        </motion.div>

        {/* Mission Statement */}
        <motion.div variants={itemVariants} className="rounded-2xl border border-border bg-card p-8 shadow-sm">
          <p className="text-base leading-relaxed text-foreground">
            Lanjut is a collection of focused digital tools designed to make your workflow simpler. 
            We believe that essential utilities like QR code generation and URL shortening should be 
            fast, reliable, and free from unnecessary complexity or intrusive tracking.
          </p>
        </motion.div>

        {/* Core Values */}
        <motion.div variants={itemVariants} className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Zap className="h-5 w-5 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">Built for Speed</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Leveraging modern technologies to ensure your tools load instantly and perform at scale.
            </p>
          </div>
          <div className="space-y-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">Privacy Focused</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Your data belongs to you. We don&apos;t use intrusive tracking or sell your information.
            </p>
          </div>
        </motion.div>

        {/* The Creator */}
        <motion.div variants={itemVariants} className="space-y-6 text-center pt-8 border-t border-border">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-foreground">The Creator</h2>
            <p className="text-muted-foreground">
              Lanjut is an independent project crafted by adsurkasur.
            </p>
          </div>
          <div className="flex justify-center gap-4">
            <a
              href="https://github.com/adsurkasur"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
            >
              <Github className="h-4 w-4" />
              Follow on GitHub
            </a>
          </div>
        </motion.div>

        {/* Support */}
        <motion.div variants={itemVariants} className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 border border-primary/10 text-xs font-medium text-primary">
            <Heart className="h-3 w-3 fill-current" />
            Community Supported
          </div>
          <p className="text-sm text-muted-foreground">
            Lanjut is free to use. Your support helps keep the tools fast and ad-free.
          </p>
        </motion.div>
      </motion.div>
    </main>
  );
}
