"use client";

import { useQRBulk } from "@/hooks/useQR";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Download, FileText, Loader2, ChevronDown } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";

const sampleCSV = `id,text,logo_base64(optional)
row-1,https://example.com,
row-2,Hello World,
row-3,https://github.com,`;

export default function QRBulk() {
  const { items, progress, total, processing, done, summary, parseCSV, generateAll, reset } = useQRBulk();
  const fileRef = useRef<HTMLInputElement>(null);
  const [showErrors, setShowErrors] = useState(false);

  const handleFile = useCallback(
    (file: File) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        parseCSV(e.target?.result as string);
      };
      reader.readAsText(file);
    },
    [parseCSV]
  );

  const downloadSample = useCallback(() => {
    const blob = new Blob([sampleCSV], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "sample-qr-bulk.csv";
    a.click();
    toast.success("Sample CSV downloaded");
  }, []);

  const downloadZip = useCallback(() => {
    // TODO: Replace with actual ZIP download from API response
    toast.success("Download started (mock)");
  }, []);

  const percent = total > 0 ? (progress / total) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Step 1: Upload */}
      {items.length === 0 && (
        <div className="space-y-4">
          <div className="rounded-lg border border-border bg-secondary/30 p-4">
            <p className="mb-2 text-sm font-medium text-foreground">CSV Format</p>
            <pre className="overflow-x-auto rounded bg-background p-3 text-xs text-muted-foreground">
              {sampleCSV}
            </pre>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={downloadSample}
              className="mt-3 flex items-center gap-2 rounded-lg border border-border bg-secondary px-3 py-1.5 text-xs font-medium text-secondary-foreground"
            >
              <Download className="h-3 w-3" /> Download sample CSV
            </motion.button>
          </div>

          <div
            onDrop={(e) => {
              e.preventDefault();
              const file = e.dataTransfer.files[0];
              if (file) handleFile(file);
            }}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => fileRef.current?.click()}
            className="flex cursor-pointer flex-col items-center gap-2 rounded-lg border-2 border-dashed border-input py-12 text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
          >
            <Upload className="h-6 w-6" />
            <span className="text-sm">Drop CSV file here or click to browse</span>
          </div>
          <input ref={fileRef} type="file" accept=".csv" className="hidden" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
        </div>
      )}

      {/* Step 2: Preview Table */}
      {items.length > 0 && !done && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-foreground">
              <FileText className="mr-1.5 inline h-4 w-4" />
              {items.length} rows loaded
            </p>
            <button onClick={reset} className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              Clear
            </button>
          </div>

          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-secondary/50">
                  <th className="px-4 py-2 text-left font-medium text-muted-foreground">#</th>
                  <th className="px-4 py-2 text-left font-medium text-muted-foreground">ID</th>
                  <th className="px-4 py-2 text-left font-medium text-muted-foreground">Text</th>
                  <th className="px-4 py-2 text-left font-medium text-muted-foreground">Logo</th>
                  <th className="px-4 py-2 text-left font-medium text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, i) => (
                  <tr key={item.id} className="border-b border-border last:border-0">
                    <td className="px-4 py-2 text-muted-foreground">{i + 1}</td>
                    <td className="px-4 py-2 font-mono text-xs">{item.id}</td>
                    <td className="max-w-[200px] truncate px-4 py-2">{item.text || "—"}</td>
                    <td className="px-4 py-2 text-muted-foreground">{item.logo_base64 ? "Yes" : "No"}</td>
                    <td className="px-4 py-2">
                      {processing && i < progress ? (
                        <span className="text-green-500 text-xs font-medium">✓ Done</span>
                      ) : processing && i === progress ? (
                        <Loader2 className="h-3 w-3 animate-spin text-primary" />
                      ) : (
                        <span className="text-xs text-muted-foreground">Pending</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Progress Bar */}
          {processing && (
            <div className="space-y-2">
              <div className="h-2 overflow-hidden rounded-full bg-secondary">
                <motion.div
                  className="h-full rounded-full bg-primary"
                  initial={{ width: 0 }}
                  animate={{ width: `${percent}%` }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                />
              </div>
              <p className="text-center text-xs text-muted-foreground">
                {progress}/{total} processed
              </p>
            </div>
          )}

          {!processing && !done && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={generateAll}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-3 text-sm font-medium text-primary-foreground"
            >
              Generate All
            </motion.button>
          )}
        </div>
      )}

      {/* Step 3: Results */}
      <AnimatePresence>
        {done && summary && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="flex gap-3">
              <div className="flex-1 rounded-lg border border-border bg-card p-4 text-center card-glow">
                <p className="text-2xl font-semibold text-foreground">{summary.succeeded}</p>
                <p className="text-xs text-muted-foreground">Succeeded</p>
              </div>
              <div className="flex-1 rounded-lg border border-border bg-card p-4 text-center card-glow">
                <p className="text-2xl font-semibold text-destructive">{summary.failed}</p>
                <p className="text-xs text-muted-foreground">Failed</p>
              </div>
            </div>

            {summary.errors.length > 0 && (
              <div className="rounded-lg border border-border bg-secondary/30 p-3">
                <button
                  onClick={() => setShowErrors(!showErrors)}
                  className="flex w-full items-center justify-between text-sm font-medium text-foreground"
                >
                  <span>{summary.errors.length} error(s)</span>
                  <ChevronDown className={`h-4 w-4 transition-transform ${showErrors ? "rotate-180" : ""}`} />
                </button>
                {showErrors && (
                  <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                    {summary.errors.map((e, i) => (
                      <li key={i}>• {e}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={downloadZip}
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-3 text-sm font-medium text-primary-foreground"
            >
              <Download className="h-4 w-4" /> Download ZIP
            </motion.button>

            <button onClick={reset} className="w-full text-center text-xs text-muted-foreground hover:text-foreground transition-colors">
              Start over
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
