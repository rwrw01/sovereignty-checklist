"use client";

import { useState, useEffect } from "react";

interface UserInfo {
  email: string;
  name: string;
  userId: number;
}

interface UseUserSessionResult {
  user: UserInfo | null;
  loading: boolean;
}

export function useUserSession(): UseUserSessionResult {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function checkSession() {
      try {
        const res = await fetch("/api/v1/auth/session");
        if (res.ok) {
          const data = await res.json();
          if (!cancelled && data.authenticated) {
            setUser({
              email: data.email,
              name: data.name,
              userId: data.userId,
            });
          }
        }
      } catch {
        // Not logged in or server error — silent
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    checkSession();

    return () => {
      cancelled = true;
    };
  }, []);

  return { user, loading };
}
