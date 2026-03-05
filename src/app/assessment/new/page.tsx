"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Card } from "@/components/ui/Card";
import type { AssessmentType } from "@/lib/validation";

const SECTOR_OPTIONS = [
  { value: "overheid", label: "Overheid" },
  { value: "zorg", label: "Zorg" },
  { value: "finance", label: "Finance" },
  { value: "onderwijs", label: "Onderwijs" },
  { value: "energie", label: "Energie" },
  { value: "telecom", label: "Telecom" },
  { value: "transport", label: "Transport" },
  { value: "overig", label: "Overig" },
];

const TRACK_INFO: Record<AssessmentType, { title: string; description: string; buttonText: string }> = {
  seal: {
    title: "SEAL Quick-Scan",
    description:
      "Beoordeel een specifieke cloudprovider of applicatie op het EU SEAL framework. 32 vragen over 8 soevereiniteitscategorieën.",
    buttonText: "Start SEAL Quick-Scan",
  },
  sra: {
    title: "Soevereiniteits Gereedheids Assessment",
    description:
      "Beoordeel hoe goed uw organisatie is voorbereid op digitale soevereiniteit. 36 vragen over 9 thema's gebaseerd op Nederlandse onderzoeken.",
    buttonText: "Start SRA Assessment",
  },
};

interface FormErrors {
  companyName?: string;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  sector?: string;
}

export default function NewAssessmentPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center"><p className="text-foreground/60">Laden...</p></div>}>
      <NewAssessmentForm />
    </Suspense>
  );
}

function NewAssessmentForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawType = searchParams.get("type");
  const assessmentType: AssessmentType =
    rawType === "sra" ? "sra" : "seal";

  const track = TRACK_INFO[assessmentType];

  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [serverError, setServerError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors({});
    setServerError("");
    setSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const body = {
      assessmentType,
      companyName: formData.get("companyName") as string,
      contactName: formData.get("contactName") as string,
      contactEmail: formData.get("contactEmail") as string,
      contactPhone: (formData.get("contactPhone") as string) || undefined,
      sector: (formData.get("sector") as string) || undefined,
    };

    try {
      const res = await fetch("/api/v1/assessments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.details) {
          const fieldErrors: FormErrors = {};
          for (const [key, messages] of Object.entries(data.details)) {
            fieldErrors[key as keyof FormErrors] = (messages as string[])[0];
          }
          setErrors(fieldErrors);
        } else {
          setServerError(data.error || "Er is een fout opgetreden.");
        }
        return;
      }

      router.push(data.redirectUrl);
    } catch {
      setServerError("Kan geen verbinding maken met de server.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="bg-background min-h-screen py-12">
      <div className="max-w-xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-2">
          {track.title}
        </h1>
        <p className="text-center text-foreground/60 mb-8">
          {track.description}
        </p>

        <Card>
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <Input
              label="Organisatie / Bedrijfsnaam"
              name="companyName"
              required
              placeholder="bijv. Gemeente Amsterdam"
              error={errors.companyName}
            />

            <Input
              label="Contactpersoon"
              name="contactName"
              required
              placeholder="bijv. Jan de Vries"
              error={errors.contactName}
            />

            <Input
              label="E-mailadres"
              name="contactEmail"
              type="email"
              required
              placeholder="jan@voorbeeld.nl"
              error={errors.contactEmail}
            />

            <Input
              label="Telefoonnummer (optioneel)"
              name="contactPhone"
              type="tel"
              placeholder="+31 6 12345678"
              error={errors.contactPhone}
            />

            <Select
              label="Sector (optioneel)"
              name="sector"
              options={SECTOR_OPTIONS}
              placeholder="— Selecteer sector —"
              error={errors.sector}
            />

            {serverError && (
              <p className="text-sm text-red-600 bg-red-50 rounded-lg p-3" role="alert">
                {serverError}
              </p>
            )}

            <Button type="submit" size="lg" disabled={submitting}>
              {submitting ? "Bezig met aanmaken..." : track.buttonText}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
