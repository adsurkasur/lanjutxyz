"use client";

import { motion } from "framer-motion";
import ShortenerForm from "@/components/ShortenerForm";
import LinkTable from "@/components/LinkTable";
import { useShortener } from "@/hooks/useShortener";
import { useAuth } from "@/hooks/useAuth";

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
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="flex-1 px-4 py-10 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-tool space-y-10">
        <div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">URL Shortener</h1>
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
          <div className="rounded-xl border border-border bg-card p-4 text-sm text-muted-foreground card-glow">
            Sign in from the top-right to save links, manage your history, and track clicks over time.
          </div>
        )}

        {isAuthenticated && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <LinkTable links={links} totalClicks={totalClicks} onDelete={deleteLink} />
          </motion.div>
        )}
      </div>
    </motion.main>
  );
}