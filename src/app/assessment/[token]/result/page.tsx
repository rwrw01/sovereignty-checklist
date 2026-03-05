"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { SealBadge } from "@/components/results/SealBadge";
import { SraBadge } from "@/components/results/SraBadge";
import { SovereigntyRadar } from "@/components/results/SovereigntyRadar";
import type { AssessmentType } from "@/lib/validation";

interface ScoreResult {
  category: string;
  categoryName: string;
  avgScore: number;
  sealLevel: number;
  weight: number;
}

interface AssessmentInfo {
  token: string;
  assessmentType: AssessmentType;
  companyName: string;
  contactName: string;
  contactEmail: string;
  sector: string | null;
  overallScore: number;
  sealLevel?: number;
  sraLevel?: number;
  completedAt: string;
}

interface ResultsData {
  assessment: AssessmentInfo;
  sovScores?: ScoreResult[];
  themeScores?: {
    theme: string;
    themeName: string;
    avgScore: number;
    sraLevel: number;
    weight: number;
  }[];
  totalAnswers: number;
}

const SEAL_LABELS: Record<number, string> = {
  0: "Geen Soevereiniteit",
  1: "Basis",
  2: "Gedeeltelijk Soeverein",
  3: "Grotendeels Soeverein",
  4: "Volledig Soeverein",
};

const SRA_LABELS: Record<number, string> = {
  0: "Niet Voorbereid",
  1: "Initieel Bewustzijn",
  2: "Gedeeltelijk Voorbereid",
  3: "Goed Voorbereid",
  4: "Optimaal Voorbereid",
};

export default function ResultPage() {
  const params = useParams();
  const router = useRouter();
  const token = params.token as string;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [results, setResults] = useState<ResultsData | null>(null);

  useEffect(() => {
    async function fetchResults() {
      try {
        const res = await fetch(`/api/v1/assessments/${token}/results`);
        if (!res.ok) {
          const data = await res.json();
          if (data.status === "draft" || data.status === "in_progress") {
            router.replace(`/assessment/${token}`);
            return;
          }
          setError(data.error || "Er is een fout opgetreden.");
          return;
        }
        setResults(await res.json());
      } catch {
        setError("Kan geen verbinding maken met de server.");
      } finally {
        setLoading(false);
      }
    }
    fetchResults();
  }, [token, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-foreground/60">Resultaten laden...</p>
      </div>
    );
  }

  if (error || !results) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={() => router.push("/")}>Terug naar home</Button>
        </Card>
      </div>
    );
  }

  const { assessment } = results;
  const isSra = assessment.assessmentType === "sra";
  const level = isSra ? (assessment.sraLevel ?? 0) : (assessment.sealLevel ?? 0);
  const levelLabels = isSra ? SRA_LABELS : SEAL_LABELS;
  const accentColor = isSra ? "#4ea7f9" : "#883486";
  const accentVar = isSra ? "var(--color-mxi-blue)" : "var(--color-mxi-purple)";

  // Normalize scores to a common format for radar chart
  const radarScores: ScoreResult[] = isSra
    ? (results.themeScores ?? []).map((s) => ({
        category: s.theme,
        categoryName: s.themeName,
        avgScore: s.avgScore,
        sealLevel: s.sraLevel,
        weight: s.weight,
      }))
    : (results.sovScores ?? []);

  const criticalFlags = radarScores.filter((s) => s.sealLevel < 3);

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Resultaten</h1>
          <p className="text-foreground/60">
            {assessment.companyName} — {assessment.contactName}
          </p>
          <p className="text-sm text-foreground/40 mt-1">
            {isSra ? "SRA Assessment" : "SEAL Quick-Scan"} — Afgerond op{" "}
            {new Date(assessment.completedAt).toLocaleDateString("nl-NL", {
              day: "numeric",
              month: "long",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>

        {/* Overall Score */}
        <Card className="text-center mb-8">
          <div className="flex flex-col items-center gap-4">
            <p className="text-sm font-medium text-foreground/60 uppercase tracking-wide">
              Overall {isSra ? "SRA" : "SEAL"} Score
            </p>
            <div className="relative w-36 h-36 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="8"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke={accentVar}
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${(assessment.overallScore / 100) * 264} 264`}
                />
              </svg>
              <span className="absolute text-3xl font-bold">
                {Math.round(assessment.overallScore)}%
              </span>
            </div>
            {isSra ? (
              <SraBadge level={level as 0 | 1 | 2 | 3 | 4} />
            ) : (
              <SealBadge level={level as 0 | 1 | 2 | 3 | 4} />
            )}
            <p className="text-lg font-medium">
              {levelLabels[level] ?? "Onbekend"}
            </p>
          </div>
        </Card>

        {/* Radar Chart */}
        <Card className="mb-8">
          <h2 className="text-lg font-bold mb-4 text-center">
            {isSra ? "Score per Thema" : "Soevereiniteit per Categorie"}
          </h2>
          <SovereigntyRadar scores={radarScores} color={accentColor} />
        </Card>

        {/* Scores Table */}
        <Card className="mb-8">
          <h2 className="text-lg font-bold mb-4">
            Score per {isSra ? "Thema" : "Categorie"}
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 pr-4">
                    {isSra ? "Thema" : "Categorie"}
                  </th>
                  <th className="text-center py-2 px-2">Gewicht</th>
                  <th className="text-center py-2 px-2">Gem. Score</th>
                  <th className="text-center py-2 pl-2">
                    {isSra ? "SRA Level" : "SEAL Level"}
                  </th>
                </tr>
              </thead>
              <tbody>
                {radarScores.map((s) => (
                  <tr
                    key={s.category}
                    className={`border-b border-gray-100 ${
                      s.sealLevel < 3 ? "bg-red-50" : ""
                    }`}
                  >
                    <td className="py-3 pr-4 font-medium">{s.categoryName}</td>
                    <td className="py-3 px-2 text-center text-foreground/60">
                      {Math.round(s.weight * 100)}%
                    </td>
                    <td className="py-3 px-2 text-center">
                      {s.avgScore.toFixed(1)} / 4.0
                    </td>
                    <td className="py-3 pl-2 text-center">
                      {isSra ? (
                        <SraBadge
                          level={s.sealLevel as 0 | 1 | 2 | 3 | 4}
                          size="sm"
                        />
                      ) : (
                        <SealBadge
                          level={s.sealLevel as 0 | 1 | 2 | 3 | 4}
                          size="sm"
                        />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Critical Flags */}
        {criticalFlags.length > 0 && (
          <Card className="mb-8 border-red-300 bg-red-50">
            <h2 className="text-lg font-bold mb-3 text-red-800">
              Aandachtspunten
            </h2>
            <p className="text-sm text-red-700 mb-4">
              De volgende {isSra ? "thema's" : "categorieën"} scoren onder{" "}
              {isSra ? "SRA-3" : "SEAL-3"} en vereisen aandacht:
            </p>
            <ul className="flex flex-col gap-2">
              {criticalFlags.map((f) => (
                <li
                  key={f.category}
                  className="flex items-center gap-3 bg-white rounded-lg px-4 py-3 border border-red-200"
                >
                  {isSra ? (
                    <SraBadge level={f.sealLevel as 0 | 1 | 2 | 3 | 4} />
                  ) : (
                    <SealBadge level={f.sealLevel as 0 | 1 | 2 | 3 | 4} />
                  )}
                  <div>
                    <p className="font-medium">{f.categoryName}</p>
                    <p className="text-sm text-foreground/60">
                      Gemiddelde: {f.avgScore.toFixed(1)} / 4.0
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        )}

        {/* Explanation: Why SEAL-3/SRA-3 is the minimum */}
        <Card className="mb-8 border-blue-200 bg-blue-50">
          <h2 className="text-lg font-bold mb-3 text-mxi-dark">
            {isSra ? "Waarom SRA-3 als minimum?" : "Waarom SEAL-3 als minimum?"}
          </h2>
          <p className="text-sm text-gray-700 mb-3">
            {isSra
              ? 'SRA-3 ("Goed Voorbereid") is het niveau waarbij een organisatie structureel voorbereid is op digitale soevereiniteitsrisico\'s. Onder dit niveau mist de organisatie:'
              : 'SEAL-3 ("Grotendeels Soeverein") is het niveau waarbij een organisatie aantoonbare controle heeft over haar digitale infrastructuur binnen EU-jurisdictie. Onder dit niveau bestaan risico\'s op:'}
          </p>
          <ul className="flex flex-col gap-1.5 mb-3 ml-4">
            {isSra ? (
              <>
                <li className="text-sm text-gray-700 list-disc">
                  Gestructureerd beleid voor digitale soevereiniteit en afhankelijkheden
                </li>
                <li className="text-sm text-gray-700 list-disc">
                  Inzicht in verborgen afhankelijkheden van niet-EU leveranciers
                </li>
                <li className="text-sm text-gray-700 list-disc">
                  Adequate incident preparedness voor leveranciersuitval
                </li>
                <li className="text-sm text-gray-700 list-disc">
                  Aansluiting bij regelgeving zoals NIS2, DORA en de European Data Act
                </li>
              </>
            ) : (
              <>
                <li className="text-sm text-gray-700 list-disc">
                  Extraterritoriale wetgeving (CLOUD Act, FISA 702) die toegang tot data kan afdwingen
                </li>
                <li className="text-sm text-gray-700 list-disc">
                  Eenzijdige wijzigingen door niet-EU partijen in service-voorwaarden
                </li>
                <li className="text-sm text-gray-700 list-disc">
                  Beperkte portabiliteit waardoor vendor lock-in ontstaat
                </li>
                <li className="text-sm text-gray-700 list-disc">
                  Onvoldoende transparantie over dataverwerking en governance
                </li>
              </>
            )}
          </ul>
          <p className="text-sm text-gray-700">
            {isSra
              ? "Het SRA framework is gebaseerd op Nederlandse onderzoeken naar digitale afhankelijkheden. SRA-3 vormt de basis voor verantwoorde digitale keuzes."
              : "Het EU SEAL Framework stelt SEAL-3 als drempel voor overheden en gereguleerde sectoren. Een bewuste keuze met mitigatie is beter dan onbewuste afhankelijkheid \u2014 maar die keuze vereist minimaal SEAL-3 inzicht."}
          </p>
        </Card>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pb-12">
          <a
            href={`/api/v1/reports/${token}/pdf`}
            download
          >
            <Button>Download PDF Rapport</Button>
          </a>
          <Link href="/">
            <Button variant="outline">Terug naar Home</Button>
          </Link>
          <Link href={`/assessment/new?type=${assessment.assessmentType}`}>
            <Button variant="secondary">Nieuwe Assessment</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
