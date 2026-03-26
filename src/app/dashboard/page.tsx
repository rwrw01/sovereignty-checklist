"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { SealBadge } from "@/components/results/SealBadge";
import { SraBadge } from "@/components/results/SraBadge";
import type { AssessmentType } from "@/lib/validation";

interface UserProfile {
  email: string;
  name: string;
  companyName: string | null;
  contactPhone: string | null;
  sector: string | null;
}

interface AssessmentItem {
  token: string;
  assessmentType: AssessmentType;
  companyName: string;
  status: "draft" | "in_progress" | "completed";
  overallScore: number | null;
  sealLevel: number | null;
  updatedAt: string;
  createdAt: string;
}

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

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  draft: { label: "Concept", color: "bg-gray-100 text-gray-700" },
  in_progress: { label: "Bezig", color: "bg-yellow-100 text-yellow-800" },
  completed: { label: "Afgerond", color: "bg-green-100 text-green-800" },
};

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [assessments, setAssessments] = useState<AssessmentItem[]>([]);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [creating, setCreating] = useState<AssessmentType | null>(null);
  const [error, setError] = useState("");

  // Check auth + fetch data
  useEffect(() => {
    async function loadDashboard() {
      try {
        const sessionRes = await fetch("/api/v1/auth/session");
        if (!sessionRes.ok) {
          router.replace("/login");
          return;
        }

        const [profileRes, assessmentsRes] = await Promise.all([
          fetch("/api/v1/user/profile"),
          fetch("/api/v1/user/assessments"),
        ]);

        if (profileRes.ok) {
          setProfile(await profileRes.json());
        }
        if (assessmentsRes.ok) {
          const data = await assessmentsRes.json();
          setAssessments(data.assessments);
        }
      } catch {
        setError("Kan dashboard niet laden.");
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, [router]);

  async function handleLogout() {
    await fetch("/api/v1/auth/session", { method: "DELETE" });
    router.push("/");
  }

  async function handleSaveProfile(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const body = {
      companyName: formData.get("companyName") as string,
      contactPhone: (formData.get("contactPhone") as string) || undefined,
      sector: (formData.get("sector") as string) || undefined,
    };

    const res = await fetch("/api/v1/user/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      setProfile((prev) =>
        prev
          ? {
              ...prev,
              companyName: body.companyName,
              contactPhone: body.contactPhone ?? null,
              sector: body.sector ?? null,
            }
          : prev,
      );
      setShowProfileModal(false);
    }
  }

  async function startAssessment(type: AssessmentType) {
    // Check if profile is complete
    if (!profile?.companyName) {
      setShowProfileModal(true);
      setCreating(type);
      return;
    }

    setCreating(type);
    setError("");

    try {
      const res = await fetch("/api/v1/user/assessments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assessmentType: type }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.needsProfile) {
          setShowProfileModal(true);
          return;
        }
        setError(data.error || "Kon assessment niet aanmaken.");
        return;
      }

      router.push(data.redirectUrl);
    } catch {
      setError("Kan geen verbinding maken met de server.");
    } finally {
      setCreating(null);
    }
  }

  async function handleProfileThenStart(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const body = {
      companyName: formData.get("companyName") as string,
      contactPhone: (formData.get("contactPhone") as string) || undefined,
      sector: (formData.get("sector") as string) || undefined,
    };

    const res = await fetch("/api/v1/user/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      setProfile((prev) =>
        prev
          ? {
              ...prev,
              companyName: body.companyName,
              contactPhone: body.contactPhone ?? null,
              sector: body.sector ?? null,
            }
          : prev,
      );
      setShowProfileModal(false);

      // Now create the assessment
      if (creating) {
        const type = creating;
        setCreating(type);

        const assessRes = await fetch("/api/v1/user/assessments", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ assessmentType: type }),
        });

        const data = await assessRes.json();
        if (assessRes.ok) {
          router.push(data.redirectUrl);
        } else {
          setError(data.error || "Kon assessment niet aanmaken.");
        }
        setCreating(null);
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-foreground/60">Dashboard laden...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">Mijn Dashboard</h1>
            <p className="text-foreground/60 text-sm">
              Welkom, {profile?.name}
              {profile?.companyName && ` — ${profile.companyName}`}
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowProfileModal(true)}
            >
              Profiel
            </Button>
            <Button variant="secondary" size="sm" onClick={handleLogout}>
              Uitloggen
            </Button>
          </div>
        </div>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 rounded-lg p-3 mb-6" role="alert">
            {error}
          </p>
        )}

        {/* Start new assessment */}
        <h2 className="text-lg font-bold mb-4">Nieuw Assessment Starten</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Card>
            <div className="flex flex-col gap-3">
              <div className="w-10 h-10 bg-mxi-purple rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">SEAL</span>
              </div>
              <h3 className="font-bold">SEAL Quick-Scan</h3>
              <p className="text-sm text-foreground/60">
                Beoordeel een cloudprovider of applicatie op het EU SEAL framework. 32 vragen, ~15 minuten.
              </p>
              <Button
                onClick={() => startAssessment("seal")}
                disabled={creating !== null}
              >
                {creating === "seal" ? "Aanmaken..." : "Start SEAL"}
              </Button>
              <a
                href="/api/v1/questionnaires/seal/excel"
                download
                className="text-xs text-mxi-purple hover:underline inline-flex items-center gap-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
                Download Vragenlijst (Excel)
              </a>
            </div>
          </Card>
          <Card>
            <div className="flex flex-col gap-3">
              <div className="w-10 h-10 bg-mxi-blue rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">SRA</span>
              </div>
              <h3 className="font-bold">SRA Assessment</h3>
              <p className="text-sm text-foreground/60">
                Beoordeel de soevereiniteitsgereedheid van uw organisatie. 36 vragen, ~20 minuten.
              </p>
              <Button
                variant="secondary"
                onClick={() => startAssessment("sra")}
                disabled={creating !== null}
              >
                {creating === "sra" ? "Aanmaken..." : "Start SRA"}
              </Button>
              <a
                href="/api/v1/questionnaires/sra/excel"
                download
                className="text-xs text-mxi-blue hover:underline inline-flex items-center gap-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
                Download Vragenlijst (Excel)
              </a>
            </div>
          </Card>
        </div>

        {/* Assessment list */}
        <h2 className="text-lg font-bold mb-4">
          Mijn Assessments ({assessments.length})
        </h2>
        {assessments.length === 0 ? (
          <Card>
            <p className="text-center text-foreground/60 py-4">
              U heeft nog geen assessments. Start hierboven met een SEAL of SRA assessment.
            </p>
          </Card>
        ) : (
          <div className="flex flex-col gap-3">
            {assessments.map((a) => {
              const statusInfo = STATUS_LABELS[a.status];
              const isSra = a.assessmentType === "sra";

              return (
                <Card key={a.token}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          isSra ? "bg-mxi-blue" : "bg-mxi-purple"
                        }`}
                      >
                        <span className="text-white font-bold text-xs">
                          {isSra ? "SRA" : "SEAL"}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">{a.companyName}</p>
                        <div className="flex items-center gap-2 text-xs text-foreground/50">
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}
                          >
                            {statusInfo.label}
                          </span>
                          <span>
                            {new Date(a.updatedAt).toLocaleDateString("nl-NL", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {a.status === "completed" && a.sealLevel !== null && (
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">
                            {Math.round(a.overallScore ?? 0)}%
                          </span>
                          {isSra ? (
                            <SraBadge level={(a.sealLevel ?? 0) as 0 | 1 | 2 | 3 | 4} size="sm" />
                          ) : (
                            <SealBadge level={(a.sealLevel ?? 0) as 0 | 1 | 2 | 3 | 4} size="sm" />
                          )}
                        </div>
                      )}
                      {a.status === "completed" ? (
                        <div className="flex gap-2">
                          <Link href={`/assessment/${a.token}/result`}>
                            <Button size="sm">Resultaten</Button>
                          </Link>
                          <a href={`/api/v1/reports/${a.token}/pdf`} download>
                            <Button size="sm" variant="outline">
                              PDF
                            </Button>
                          </a>
                        </div>
                      ) : (
                        <Link href={`/assessment/${a.token}`}>
                          <Button size="sm" variant="outline">
                            Verder
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {/* Profile Modal */}
        {showProfileModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-6">
              <h2 className="text-lg font-bold mb-4">Organisatiegegevens</h2>
              <p className="text-sm text-foreground/60 mb-4">
                Vul uw organisatiegegevens in. Deze worden automatisch ingevuld bij nieuwe assessments.
              </p>
              <form
                onSubmit={creating ? handleProfileThenStart : handleSaveProfile}
                className="flex flex-col gap-4"
              >
                <Input
                  label="Organisatie / Bedrijfsnaam"
                  name="companyName"
                  required
                  defaultValue={profile?.companyName ?? ""}
                  placeholder="bijv. Gemeente Amsterdam"
                />
                <Input
                  label="Telefoonnummer (optioneel)"
                  name="contactPhone"
                  type="tel"
                  defaultValue={profile?.contactPhone ?? ""}
                  placeholder="+31 6 12345678"
                />
                <Select
                  label="Sector (optioneel)"
                  name="sector"
                  options={SECTOR_OPTIONS}
                  placeholder="— Selecteer sector —"
                  defaultValue={profile?.sector ?? ""}
                />
                <div className="flex gap-3 justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowProfileModal(false);
                      setCreating(null);
                    }}
                  >
                    Annuleren
                  </Button>
                  <Button type="submit">
                    {creating ? "Opslaan & Starten" : "Opslaan"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
