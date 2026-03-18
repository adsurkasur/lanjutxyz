"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { QrCode, Link as LinkIcon, ArrowRight } from "lucide-react";

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

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-4 py-24 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Simple tools, serious results.
        </h1>
        <p className="mx-auto mt-4 max-w-md text-base text-muted-foreground">
          QR codes and short links - built for people who care about details.
        </p>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="mt-16 grid w-full max-w-2xl gap-4 sm:grid-cols-2"
      >
        {tools.map((tool) => (
          <motion.div key={tool.href} variants={item}>
            <Link href={tool.href}>
              <motion.div
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="group relative rounded-xl border border-border bg-card p-6 card-glow transition-colors"
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
    </main>
  );
}