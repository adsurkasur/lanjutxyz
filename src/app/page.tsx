"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { QrCode, Link as LinkIcon, ArrowRight } from "lucide-react";
import {
  containerVariants,
  itemVariants,
  pageVariants,
  buttonHover,
  buttonTap,
  buttonTransition,
} from "@/lib/motion";

const tools = [
  {
    title: "QR Code Generator",
    description:
      "Generate single or bulk QR codes with optional logo overlay. Download as PNG or ZIP.",
    icon: QrCode,
    href: "/qr",
    gradient: "from-primary/10 to-primary/5",
  },
  {
    title: "URL Shortener",
    description:
      "Create branded short links with custom slugs. Track clicks and manage all your links.",
    icon: LinkIcon,
    href: "/short",
    gradient: "from-primary/10 to-primary/5",
  },
];

export default function HomePage() {
  return (
    <main className="flex-1 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-tool flex-col items-center justify-center space-y-8 text-center">
        <motion.div
          initial={pageVariants.initial}
          animate={pageVariants.animate}
          transition={pageVariants.transition}
          className="space-y-3"
        >
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Simple tools, serious results.
          </h1>
          <p className="mx-auto max-w-md text-base text-muted-foreground">
            QR codes and short links - built for people who care about details.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid w-full max-w-2xl gap-4 sm:grid-cols-2"
        >
          {tools.map((tool) => (
            <motion.div key={tool.href} variants={itemVariants}>
              <Link href={tool.href}>
                <motion.div
                  whileHover={buttonHover}
                  whileTap={buttonTap}
                  transition={buttonTransition}
                  className="group relative flex min-h-[160px] flex-col justify-center rounded-xl border border-border bg-card p-5 card-glow transition-colors"
                >
                  <div
                    className={`mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${tool.gradient}`}
                  >
                    <tool.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-base font-semibold tracking-tight text-foreground">{tool.title}</h2>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{tool.description}</p>
                  <div className="mt-4 flex items-center gap-1 text-sm font-medium text-primary">
                    Get started
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </main>
  );
}