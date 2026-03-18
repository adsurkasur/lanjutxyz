"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { Loader2, X } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import TurnstileWidget from "@/components/TurnstileWidget";
import { verifyCaptcha } from "@/lib/captcha";
import { fadeVariants } from "@/lib/motion";

type AuthModalProps = {
  open: boolean;
  onClose: () => void;
};

export default function AuthModal({ open, onClose }: AuthModalProps) {
  const { signInWithEmail, signUpWithEmail, error, setError } = useAuth();
  const [activeTab, setActiveTab] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);

  useEffect(() => {
    setCaptchaToken(null);
  }, [activeTab]);

  const handleSubmit = async () => {
    if (!email.trim() || !password.trim()) return;

    setSubmitting(true);
    setError(null);
    setSuccessMessage(null);

    if (activeTab === "signin") {
      const ok = await signInWithEmail(email, password);
      if (ok) {
        onClose();
      }
    } else {
      const needsCaptcha = !!process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
      if (needsCaptcha && !captchaToken) {
        setError("Please complete the security check");
        setSubmitting(false);
        return;
      }

      if (captchaToken) {
        const valid = await verifyCaptcha(captchaToken);
        if (!valid) {
          setError("Captcha verification failed.");
          setSubmitting(false);
          return;
        }
      }

      const ok = await signUpWithEmail(email, password);
      if (ok) {
        setSuccessMessage("Check your email to confirm your account");
        setCaptchaToken(null);
      }
    }

    setSubmitting(false);
  };

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) onClose();
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50" />
        <Dialog.Content asChild>
          <motion.div
            variants={fadeVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="fixed left-1/2 top-1/2 z-50 w-[94vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl border border-border bg-card p-4 sm:w-[92vw] sm:p-6 card-glow"
          >
            <div className="mb-4 flex items-center justify-between">
              <Dialog.Title className="text-base font-semibold text-foreground">
                {activeTab === "signin" ? "Sign In" : "Sign Up"}
              </Dialog.Title>
              <Dialog.Close asChild>
                <button
                  className="rounded p-1 text-muted-foreground transition-colors hover:text-foreground"
                  aria-label="Close auth modal"
                >
                  <X className="h-4 w-4" />
                </button>
              </Dialog.Close>
            </div>

            <div className="mb-4 grid grid-cols-2 gap-1 rounded-lg bg-secondary p-1">
              <button
                onClick={() => {
                  setActiveTab("signin");
                  setError(null);
                  setSuccessMessage(null);
                  setCaptchaToken(null);
                }}
                className={`rounded-md px-3 py-2.5 text-sm transition-colors sm:py-2 ${
                  activeTab === "signin" ? "bg-card text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => {
                  setActiveTab("signup");
                  setError(null);
                  setSuccessMessage(null);
                  setCaptchaToken(null);
                }}
                className={`rounded-md px-3 py-2.5 text-sm transition-colors sm:py-2 ${
                  activeTab === "signup" ? "bg-card text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Sign Up
              </button>
            </div>

            <div className="space-y-4">
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                type="email"
                className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 sm:py-2 sm:text-sm"
              />
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                type="password"
                className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 sm:py-2 sm:text-sm"
              />

              {activeTab === "signup" && (
                <TurnstileWidget
                  onVerify={setCaptchaToken}
                  onError={() => setCaptchaToken(null)}
                />
              )}

              {error && <p className="text-sm text-destructive">{error}</p>}
              {activeTab === "signup" && successMessage && (
                <p className="text-sm text-muted-foreground">{successMessage}</p>
              )}

              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-3 text-sm font-medium text-primary-foreground disabled:opacity-50"
              >
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                {activeTab === "signin" ? "Sign In" : "Sign Up"}
              </button>
            </div>
          </motion.div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}