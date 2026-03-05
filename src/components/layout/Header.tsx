"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUserSession } from "@/lib/hooks/useUserSession";

export function Header() {
  const { user, loading } = useUserSession();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/v1/auth/session", { method: "DELETE" });
    router.push("/");
    router.refresh();
  }

  return (
    <header className="bg-mxi-dark text-white">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-mxi-purple rounded-lg flex items-center justify-center font-bold text-lg">
            MXI
          </div>
          <span className="text-lg font-semibold hidden sm:inline">
            Soevereiniteits Checklist
          </span>
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link
            href="/"
            className="hover:text-mxi-blue transition-colors"
          >
            Home
          </Link>
          {!loading && user ? (
            <>
              <Link
                href="/dashboard"
                className="hover:text-mxi-blue transition-colors"
              >
                Dashboard
              </Link>
              <span className="text-white/60 hidden sm:inline">
                {user.name}
              </span>
              <button
                onClick={handleLogout}
                className="hover:text-mxi-blue transition-colors"
              >
                Uitloggen
              </button>
            </>
          ) : (
            <>
              <Link
                href="/assessment/new"
                className="hover:text-mxi-blue transition-colors hidden sm:inline"
              >
                Assessment
              </Link>
              <Link
                href="/login"
                className="bg-mxi-purple hover:bg-mxi-purple/80 px-4 py-2 rounded-lg transition-colors"
              >
                Inloggen
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
