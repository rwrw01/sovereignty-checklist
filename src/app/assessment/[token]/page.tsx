"use client";

import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { getQuestionsByCategory, TOTAL_QUESTIONS } from "@/lib/seal/questions";
import { SOV_CATEGORIES, SOV_WEIGHTS } from "@/lib/seal/weights";
import { getSraQuestionsByTheme, SRA_TOTAL_QUESTIONS } from "@/lib/sra/questions";
import { SRA_THEMES, SRA_WEIGHTS } from "@/lib/sra/weights";
import type { AssessmentType } from "@/lib/validation";

interface SavedAnswer {
  questionId: string;
  score: number;
  notes?: string;
}

interface AssessmentData {
  assessment: {
    token: string;
    assessmentType: AssessmentType;
    companyName: string;
    contactName: string;
    status: string;
  };
  answers: SavedAnswer[];
}

/** Unified step data for both tracks */
interface StepConfig {
  key: string;
  name: string;
  weight: number;
  questions: {
    id: string;
    question: string;
    context?: string;
    levels: { level: number; label?: string; description: string }[];
  }[];
}

function buildSealSteps(): StepConfig[] {
  return SOV_CATEGORIES.map((cat) => ({
    key: cat,
    name: SOV_WEIGHTS[cat].nameNl,
    weight: SOV_WEIGHTS[cat].weight,
    questions: getQuestionsByCategory(cat),
  }));
}

function buildSraSteps(): StepConfig[] {
  return SRA_THEMES.map((theme) => ({
    key: theme,
    name: SRA_WEIGHTS[theme].nameNl,
    weight: SRA_WEIGHTS[theme].weight,
    questions: getSraQuestionsByTheme(theme).map((q) => ({
      id: q.id,
      question: q.question,
      context: q.context,
      levels: q.levels.map((l) => ({ level: l.level, description: l.description })),
    })),
  }));
}

const LEVEL_COLORS = [
  "bg-red-100 border-red-300 text-red-800",
  "bg-orange-100 border-orange-300 text-orange-800",
  "bg-yellow-100 border-yellow-300 text-yellow-800",
  "bg-blue-100 border-blue-300 text-blue-800",
  "bg-green-100 border-green-300 text-green-800",
];

const LEVEL_COLORS_SELECTED = [
  "bg-red-500 border-red-600 text-white",
  "bg-orange-500 border-orange-600 text-white",
  "bg-yellow-500 border-yellow-600 text-white",
  "bg-blue-500 border-blue-600 text-white",
  "bg-green-500 border-green-600 text-white",
];

const SRA_LEVEL_LABELS = ["Niveau 0", "Niveau 1", "Niveau 2", "Niveau 3", "Niveau 4"];

export default function QuestionnairePage() {
  const params = useParams();
  const router = useRouter();
  const token = params.token as string;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [data, setData] = useState<AssessmentData | null>(null);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [currentStep, setCurrentStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [lastSaved, setLastSaved] = useState<string>("");
  const [expandedContext, setExpandedContext] = useState<string | null>(null);
  const saveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Fetch assessment data
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`/api/v1/assessments/${token}`);
        if (!res.ok) {
          if (res.status === 404) {
            setError("Assessment niet gevonden. Controleer uw link.");
          } else {
            setError("Er is een fout opgetreden.");
          }
          return;
        }
        const json: AssessmentData = await res.json();

        if (json.assessment.status === "completed") {
          router.replace(`/assessment/${token}/result`);
          return;
        }

        setData(json);

        // Restore saved answers
        const restored: Record<string, number> = {};
        for (const a of json.answers) {
          restored[a.questionId] = a.score;
        }
        setAnswers(restored);
      } catch {
        setError("Kan geen verbinding maken met de server.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [token, router]);

  // Build step config based on assessment type
  const assessmentType = data?.assessment.assessmentType ?? "seal";
  const steps = useMemo(() => {
    return assessmentType === "sra" ? buildSraSteps() : buildSealSteps();
  }, [assessmentType]);

  const totalQuestions = assessmentType === "sra" ? SRA_TOTAL_QUESTIONS : TOTAL_QUESTIONS;
  const isSra = assessmentType === "sra";

  // Auto-save function
  const autoSave = useCallback(
    async (updatedAnswers: Record<string, number>) => {
      if (Object.keys(updatedAnswers).length === 0) return;

      setSaving(true);
      try {
        const payload = Object.entries(updatedAnswers).map(([questionId, score]) => ({
          questionId,
          score,
        }));

        await fetch(`/api/v1/assessments/${token}/answers`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ answers: payload }),
        });

        setLastSaved(new Date().toLocaleTimeString("nl-NL"));
      } catch {
        // Silent fail for auto-save
      } finally {
        setSaving(false);
      }
    },
    [token],
  );

  // Handle answer selection
  function handleAnswer(questionId: string, score: number) {
    const updated = { ...answers, [questionId]: score };
    setAnswers(updated);

    // Debounced auto-save (1.5s after last change)
    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(() => autoSave(updated), 1500);
  }

  // Submit final assessment
  async function handleSubmit() {
    setSubmitting(true);
    try {
      const payload = Object.entries(answers).map(([questionId, score]) => ({
        questionId,
        score,
      }));

      const res = await fetch(`/api/v1/assessments/${token}/answers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: payload }),
      });

      if (!res.ok) {
        const errData = await res.json();
        setError(errData.error || "Er is een fout opgetreden bij het afronden.");
        return;
      }

      router.push(`/assessment/${token}/result`);
    } catch {
      setError("Kan geen verbinding maken met de server.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-foreground/60">Assessment laden...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={() => router.push("/")}>Terug naar home</Button>
        </Card>
      </div>
    );
  }

  if (!data) return null;

  const step = steps[currentStep];
  const answeredCount = Object.keys(answers).length;
  const progressPercent = Math.round((answeredCount / totalQuestions) * 100);
  const allAnswered = answeredCount === totalQuestions;

  // Running question number offset
  let questionOffset = 0;
  for (let i = 0; i < currentStep; i++) {
    questionOffset += steps[i].questions.length;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="font-semibold text-sm">{data.assessment.companyName}</p>
              <p className="text-xs text-foreground/50">
                {isSra ? "SRA" : "SEAL"} — {answeredCount} / {totalQuestions} vragen beantwoord
              </p>
            </div>
            <div className="text-right text-xs text-foreground/50">
              {saving && <span className={isSra ? "text-mxi-blue" : "text-mxi-purple"}>Opslaan...</span>}
              {!saving && lastSaved && <span>Opgeslagen om {lastSaved}</span>}
            </div>
          </div>
          {/* Progress bar */}
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${isSra ? "bg-mxi-blue" : "bg-mxi-purple"}`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Step navigation */}
      <div className="max-w-4xl mx-auto px-4 pt-6">
        <div className="flex gap-1 mb-6 overflow-x-auto pb-2">
          {steps.map((s, idx) => {
            const stepAnswered = s.questions.filter((q) => answers[q.id] !== undefined).length;
            const stepComplete = stepAnswered === s.questions.length;

            return (
              <button
                key={s.key}
                onClick={() => setCurrentStep(idx)}
                className={`
                  flex-shrink-0 px-3 py-2 rounded-lg text-xs font-medium transition-colors
                  ${idx === currentStep
                    ? isSra
                      ? "bg-mxi-blue text-white"
                      : "bg-mxi-purple text-white"
                    : stepComplete
                      ? "bg-green-100 text-green-800"
                      : stepAnswered > 0
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-gray-100 text-foreground/60"
                  }
                `}
              >
                <span className="block">{idx + 1}.</span>
                <span className="block truncate max-w-[80px]">
                  {s.name.split(" ")[0]}
                </span>
              </button>
            );
          })}
        </div>

        {/* Step header */}
        <div className="mb-6">
          <h2 className="text-xl font-bold">
            {isSra ? `Thema ${currentStep + 1}` : `SOV-${currentStep + 1}`}: {step.name}
          </h2>
          <p className="text-sm text-foreground/60">
            Gewicht: {Math.round(step.weight * 100)}% — {step.questions.length} vragen
          </p>
        </div>

        {/* Questions */}
        <div className="flex flex-col gap-6 pb-6">
          {step.questions.map((q, qIdx) => (
            <Card key={q.id}>
              <p className="font-medium mb-2">
                <span className={`mr-2 ${isSra ? "text-mxi-blue" : "text-mxi-purple"}`}>
                  Vraag {questionOffset + qIdx + 1}/{totalQuestions}
                </span>
                {q.question}
              </p>

              {/* SRA context toggle */}
              {q.context && (
                <div className="mb-3">
                  <button
                    type="button"
                    onClick={() =>
                      setExpandedContext(expandedContext === q.id ? null : q.id)
                    }
                    className="text-xs text-mxi-blue hover:underline"
                  >
                    {expandedContext === q.id ? "Verberg context" : "Waarom is dit belangrijk?"}
                  </button>
                  {expandedContext === q.id && (
                    <p className="mt-2 text-xs text-foreground/60 bg-blue-50 rounded-lg p-3">
                      {q.context}
                    </p>
                  )}
                </div>
              )}

              <div className="flex flex-col gap-2">
                {q.levels.map((level) => {
                  const isSelected = answers[q.id] === level.level;
                  const levelLabel = level.label ?? SRA_LEVEL_LABELS[level.level];
                  return (
                    <button
                      key={level.level}
                      type="button"
                      onClick={() => handleAnswer(q.id, level.level)}
                      className={`
                        w-full text-left px-4 py-3 rounded-lg border-2 transition-all text-sm
                        ${isSelected
                          ? LEVEL_COLORS_SELECTED[level.level]
                          : `${LEVEL_COLORS[level.level]} hover:opacity-80`
                        }
                      `}
                    >
                      <span className="font-semibold mr-2">{levelLabel}:</span>
                      {level.description}
                    </button>
                  );
                })}
              </div>
            </Card>
          ))}
        </div>

        {/* Navigation buttons */}
        <div className="flex justify-between items-center pb-12 pt-4 border-t border-gray-200">
          <Button
            variant="outline"
            onClick={() => setCurrentStep((s) => Math.max(0, s - 1))}
            disabled={currentStep === 0}
          >
            Vorige
          </Button>

          <span className="text-sm text-foreground/50">
            {isSra ? "Thema" : "Categorie"} {currentStep + 1} van {steps.length}
          </span>

          {currentStep < steps.length - 1 ? (
            <Button onClick={() => setCurrentStep((s) => s + 1)}>
              Volgende
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={!allAnswered || submitting}
            >
              {submitting
                ? "Bezig met afronden..."
                : allAnswered
                  ? "Afronden & Resultaat"
                  : `Nog ${totalQuestions - answeredCount} vragen`}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
