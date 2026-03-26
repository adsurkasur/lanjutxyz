import { useCallback, useEffect, useState } from "react";
import { pb } from "@/lib/pocketbase";

export function useAuth() {
  const [user, setUser] = useState(pb.authStore.model);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Initial load
    setUser(pb.authStore.model);
    setLoading(false);

    // Listen for auth changes
    const removeListener = pb.authStore.onChange((token, model) => {
      setUser(model);
    });

    return () => {
      removeListener();
    };
  }, []);

  const signInWithEmail = useCallback(async (email: string, password: string) => {
    setError(null);
    try {
      await pb.collection("users").authWithPassword(email, password);
      return true;
    } catch (err: any) {
      setError(err.message || "Failed to sign in");
      return false;
    }
  }, []);

  const signUpWithEmail = useCallback(async (email: string, password: string) => {
    setError(null);
    try {
      await pb.collection("users").create({
        email,
        password,
        passwordConfirm: password,
        emailVisibility: true,
      });
      // Optionally auto sign-in after sign up
      await pb.collection("users").authWithPassword(email, password);
      return true;
    } catch (err: any) {
      setError(err.message || "Failed to sign up");
      return false;
    }
  }, []);

  const signOut = useCallback(async () => {
    setError(null);
    pb.authStore.clear();
  }, []);

  return {
    user,
    session: pb.authStore.token ? { user: pb.authStore.model } : null,
    loading,
    signInWithEmail,
    signUpWithEmail,
    signOut,
    error,
    setError,
  };
}