import { NextRequest, NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import React from "react";
import { tokenSchema } from "@/lib/validation";
import { findByToken, getSovScores, getSraScores } from "@/db/repositories/assessments";
import { SOV_WEIGHTS } from "@/lib/seal/weights";
import { SRA_WEIGHTS } from "@/lib/sra/weights";
import { SovereigntyReport } from "@/lib/pdf/report";
import type { ReportProps } from "@/lib/pdf/report";
import type { SovCategory } from "@/lib/seal/types";
import type { SraTheme } from "@/lib/sra/types";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ token: string }> },
) {
  try {
    const { token } = await params;
    const parsed = tokenSchema.safeParse(token);
    if (!parsed.success) {
      return NextResponse.json({ error: "Ongeldig token" }, { status: 400 });
    }

    const assessment = await findByToken(parsed.data);
    if (!assessment) {
      return NextResponse.json(
        { error: "Assessment niet gevonden" },
        { status: 404 },
      );
    }

    if (assessment.status !== "completed") {
      return NextResponse.json(
        { error: "Assessment is nog niet afgerond" },
        { status: 400 },
      );
    }

    let reportProps: ReportProps;

    if (assessment.assessmentType === "sra") {
      const scores = await getSraScores(assessment.id);
      reportProps = {
        assessmentType: "sra",
        companyName: assessment.companyName,
        contactName: assessment.contactName,
        contactEmail: assessment.contactEmail,
        sector: assessment.sector,
        overallScore: assessment.overallScore ?? 0,
        level: assessment.sealLevel ?? 0,
        completedAt: assessment.completedAt ?? assessment.updatedAt,
        scores: scores.map((s) => ({
          category: s.theme,
          categoryName: SRA_WEIGHTS[s.theme as SraTheme]?.nameNl ?? s.theme,
          avgScore: s.avgScore,
          level: s.sraLevel,
          weight: SRA_WEIGHTS[s.theme as SraTheme]?.weight ?? 0,
        })),
      };
    } else {
      const scores = await getSovScores(assessment.id);
      reportProps = {
        assessmentType: "seal",
        companyName: assessment.companyName,
        contactName: assessment.contactName,
        contactEmail: assessment.contactEmail,
        sector: assessment.sector,
        overallScore: assessment.overallScore ?? 0,
        level: assessment.sealLevel ?? 0,
        completedAt: assessment.completedAt ?? assessment.updatedAt,
        scores: scores.map((s) => ({
          category: s.sovCategory,
          categoryName: SOV_WEIGHTS[s.sovCategory as SovCategory]?.nameNl ?? s.sovCategory,
          avgScore: s.avgScore,
          level: s.sealLevel,
          weight: SOV_WEIGHTS[s.sovCategory as SovCategory]?.weight ?? 0,
        })),
      };
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pdfBuffer = await renderToBuffer(
      React.createElement(SovereigntyReport, reportProps) as any,
    );

    const prefix = assessment.assessmentType === "sra" ? "sra-rapport" : "soevereiniteitsrapport";
    const filename = `${prefix}-${assessment.companyName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/-+$/, "")}-${new Date().toISOString().split("T")[0]}.pdf`;

    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("PDF generation failed:", error);
    return NextResponse.json(
      { error: "Er is een fout opgetreden bij het genereren van het rapport." },
      { status: 500 },
    );
  }
}
