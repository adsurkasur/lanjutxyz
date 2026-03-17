import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ShortenerForm from "@/components/ShortenerForm";
import LinkTable from "@/components/LinkTable";
import { useShortener } from "@/hooks/useShortener";

export default function Shortener() {
  const { url, setUrl, slug, setSlug, result, loading, shorten, isAuthenticated, toggleAuth, links, deleteLink, totalClicks, setResult } = useShortener();

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <motion.main
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="flex-1 px-4 py-10 sm:px-6 lg:px-8"
      >
        <div className="mx-auto max-w-tool space-y-10">
          <div>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-foreground">URL Shortener</h1>
                <p className="mt-1 text-sm text-muted-foreground">Create branded short links.</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={toggleAuth}
                className="rounded-lg border border-border bg-secondary px-3 py-1.5 text-xs font-medium text-secondary-foreground transition-colors"
              >
                {isAuthenticated ? "Sign Out (demo)" : "Sign In (demo)"}
              </motion.button>
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
            isAuthenticated={isAuthenticated}
            toggleAuth={toggleAuth}
          />

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

      <Footer />
    </div>
  );
}
