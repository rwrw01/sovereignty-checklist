"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { SealBadge } from "@/components/results/SealBadge";
import { SraBadge } from "@/components/results/SraBadge";

interface AssessmentSummary {
  id: number;
  token: string;
  assessmentType: "seal" | "sra";
  companyName: string;
  contactName: string;
  contactEmail: string;
  sector: string | null;
  status: "draft" | "in_progress" | "completed";
  overallScore: number | null;
  sealLevel: number | null;
  createdAt: string;
  completedAt: string | null;
}

interface Stats {
  total: number;
  draft: number;
  in_progress: number;
  completed: number;
}

interface DashboardData {
  assessments: AssessmentSummary[];
  stats: Stats;
}

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  draft: { label: "Concept", color: "bg-gray-100 text-gray-700" },
  in_progress: { label: "Bezig", color: "bg-yellow-100 text-yellow-700" },
  completed: { label: "Afgerond", color: "bg-green-100 text-green-700" },
};

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [data, setData] = useState<DashboardData | null>(null);
  const [username, setUsername] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        // Check auth
        const authRes = await fetch("/api/v1/admin/auth");
        if (!authRes.ok) {
          router.replace("/admin/login");
          return;
        }
        const authData = await authRes.json();
        setUsername(authData.username);

        // Fetch assessments
        const res = await fetch("/api/v1/admin/assessments");
        if (!res.ok) {
          setError("Kan assessments niet laden.");
          return;
        }
        setData(await res.json());
      } catch {
        setError("Kan geen verbinding maken met de server.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [router]);

  async function handleLogout() {
    await fetch("/api/v1/admin/auth", { method: "DELETE" });
    router.replace("/admin/login");
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-foreground/60">Dashboard laden...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Opnieuw proberen</Button>
        </Card>
      </div>
    );
  }

  if (!data) return null;

  const { assessments, stats } = data;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-mxi-dark text-white">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold">Admin Dashboard</h1>
            <p className="text-xs text-white/50">Ingelogd als {username}</p>
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            Uitloggen
          </Button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Totaal", value: stats.total, color: "text-foreground" },
            { label: "Concept", value: stats.draft, color: "text-gray-500" },
            { label: "Bezig", value: stats.in_progress, color: "text-yellow-600" },
            { label: "Afgerond", value: stats.completed, color: "text-green-600" },
          ].map((s) => (
            <Card key={s.label} className="text-center">
              <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-sm text-foreground/60">{s.label}</p>
            </Card>
          ))}
        </div>

        {/* Assessments table */}
        <Card>
          <h2 className="text-lg font-bold mb-4">Alle Assessments</h2>
          {assessments.length === 0 ? (
            <p className="text-foreground/60 text-center py-8">
              Nog geen assessments.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 text-left">
                    <th className="py-2 pr-3">Organisatie</th>
                    <th className="py-2 px-3">Type</th>
                    <th className="py-2 px-3">Contact</th>
                    <th className="py-2 px-3">Status</th>
                    <th className="py-2 px-3 text-center">Score</th>
                    <th className="py-2 px-3">Aangemaakt</th>
                    <th className="py-2 pl-3">Acties</th>
                  </tr>
                </thead>
                <tbody>
                  {assessments.map((a) => {
                    const statusConfig = STATUS_LABELS[a.status] ?? STATUS_LABELS.draft;
                    return (
                      <tr key={a.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 pr-3 font-medium">{a.companyName}</td>
                        <td className="py-3 px-3">
                          <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full ${
                            a.assessmentType === "sra"
                              ? "bg-mxi-blue/10 text-mxi-blue"
                              : "bg-mxi-purple/10 text-mxi-purple"
                          }`}>
                            {a.assessmentType.toUpperCase()}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-foreground/60">
                          {a.contactName}
                        </td>
                        <td className="py-3 px-3">
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusConfig.color}`}>
                            {statusConfig.label}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-center">
                          {a.status === "completed" && a.overallScore != null ? (
                            <div className="flex items-center justify-center gap-2">
                              <span className="font-medium">{Math.round(a.overallScore)}%</span>
                              {a.assessmentType === "sra" ? (
                                <SraBadge level={(a.sealLevel ?? 0) as 0|1|2|3|4} size="sm" />
                              ) : (
                                <SealBadge level={(a.sealLevel ?? 0) as 0|1|2|3|4} size="sm" />
                              )}
                            </div>
                          ) : (
                            <span className="text-foreground/30">—</span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-foreground/60">
                          {new Date(a.createdAt).toLocaleDateString("nl-NL", {
                            day: "numeric",
                            month: "short",
                          })}
                        </td>
                        <td className="py-3 pl-3">
                          <div className="flex gap-2">
                            {a.status === "completed" && (
                              <>
                                <Link
                                  href={`/assessment/${a.token}/result`}
                                  className="text-xs text-mxi-purple hover:underline"
                                >
                                  Bekijk
                                </Link>
                                <a
                                  href={`/api/v1/reports/${a.token}/pdf`}
                                  className="text-xs text-mxi-blue hover:underline"
                                  download
                                >
                                  PDF
                                </a>
                              </>
                            )}
                            {a.status !== "completed" && (
                              <Link
                                href={`/assessment/${a.token}`}
                                className="text-xs text-foreground/60 hover:underline"
                              >
                                Open
                              </Link>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
