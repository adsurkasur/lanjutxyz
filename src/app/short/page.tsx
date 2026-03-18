"use client";

import { motion } from "framer-motion";
import ShortenerForm from "@/components/ShortenerForm";
import LinkTable from "@/components/LinkTable";
import { useShortener } from "@/hooks/useShortener";
import { useAuth } from "@/hooks/useAuth";
import { pageVariants, itemVariants } from "@/lib/motion";

export default function ShortenerPage() {
  const { user } = useAuth();
  const {
    url,
    setUrl,
    slug,
    setSlug,
    result,
    error,
    setError,
    loading,
    shorten,
    isAuthenticated,
    links,
    deleteLink,
    totalClicks,
  } = useShortener();

  return (
    <motion.main
      initial={pageVariants.initial}
      animate={pageVariants.animate}
      transition={pageVariants.transition}
      className="flex-1 px-4 py-6 sm:px-6 sm:py-10 lg:px-8"
    >
      <div className="mx-auto max-w-tool space-y-8">
        <div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">URL Shortener</h1>
            <p className="mt-1 text-sm text-muted-foreground">Create branded short links.</p>
          </div>
        </div>

        <ShortenerForm
          url={url}
          setUrl={setUrl}
          slug={slug}
          setSlug={setSlug}
          loading={loading}
          shorten={shorten}
          result={result}
          error={error}
          setError={setError}
          isAuthenticated={isAuthenticated}
        />

        {!user && (
          <div className="rounded-xl border border-border bg-card p-5 text-sm text-muted-foreground card-glow">
            Sign in from the top-right to save links, manage your history, and track clicks over time.
          </div>
        )}

        {isAuthenticated && (
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="show"
          >
            <LinkTable links={links} totalClicks={totalClicks} onDelete={deleteLink} />
          </motion.div>
        )}
      </div>
    </motion.main>
  );
}