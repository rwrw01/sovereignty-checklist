"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";

export default function LoginPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const body = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    };

    try {
      const res = await fetch("/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Inloggen mislukt.");
        return;
      }

      router.push("/dashboard");
    } catch {
      setError("Kan geen verbinding maken met de server.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="w-full max-w-sm px-4">
        <h1 className="text-2xl font-bold text-center mb-2">Inloggen</h1>
        <p className="text-center text-foreground/60 mb-6">
          Log in om uw assessments te beheren
        </p>
        <Card>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              label="E-mailadres"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="jan@voorbeeld.nl"
            />
            <Input
              label="Wachtwoord"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              placeholder="Minimaal 12 tekens"
            />

            {error && (
              <p className="text-sm text-red-600 bg-red-50 rounded-lg p-3" role="alert">
                {error}
              </p>
            )}

            <Button type="submit" disabled={submitting}>
              {submitting ? "Inloggen..." : "Inloggen"}
            </Button>
          </form>
        </Card>
        <p className="text-center text-sm text-foreground/60 mt-4">
          Nog geen account?{" "}
          <Link href="/register" className="text-mxi-purple hover:underline font-medium">
            Registreer hier
          </Link>
        </p>
      </div>
    </div>
  );
}
