"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";

export default function RegisterPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setFieldErrors({});
    setSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (password !== confirmPassword) {
      setFieldErrors({ confirmPassword: "Wachtwoorden komen niet overeen." });
      setSubmitting(false);
      return;
    }

    const body = {
      email: formData.get("email") as string,
      name: formData.get("name") as string,
      password,
    };

    try {
      const res = await fetch("/api/v1/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.details) {
          const errs: Record<string, string> = {};
          for (const [key, messages] of Object.entries(data.details)) {
            errs[key] = (messages as string[])[0];
          }
          setFieldErrors(errs);
        } else {
          setError(data.error || "Registratie mislukt.");
        }
        return;
      }

      // Auto-login succeeded, redirect to dashboard
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
        <h1 className="text-2xl font-bold text-center mb-2">Registreren</h1>
        <p className="text-center text-foreground/60 mb-6">
          Maak een account aan om assessments bij te houden
        </p>
        <Card>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              label="Naam"
              name="name"
              required
              autoComplete="name"
              placeholder="bijv. Jan de Vries"
              error={fieldErrors.name}
            />
            <Input
              label="E-mailadres"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="jan@voorbeeld.nl"
              error={fieldErrors.email}
            />
            <Input
              label="Wachtwoord"
              name="password"
              type="password"
              required
              autoComplete="new-password"
              placeholder="Minimaal 12 tekens"
              error={fieldErrors.password}
            />
            <Input
              label="Wachtwoord bevestigen"
              name="confirmPassword"
              type="password"
              required
              autoComplete="new-password"
              placeholder="Herhaal wachtwoord"
              error={fieldErrors.confirmPassword}
            />

            {error && (
              <p className="text-sm text-red-600 bg-red-50 rounded-lg p-3" role="alert">
                {error}
              </p>
            )}

            <Button type="submit" disabled={submitting}>
              {submitting ? "Registreren..." : "Account aanmaken"}
            </Button>
          </form>
        </Card>
        <p className="text-center text-sm text-foreground/60 mt-4">
          Al een account?{" "}
          <Link href="/login" className="text-mxi-purple hover:underline font-medium">
            Log hier in
          </Link>
        </p>
      </div>
    </div>
  );
}
