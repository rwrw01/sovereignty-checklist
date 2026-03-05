import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import type { AssessmentType } from "@/lib/validation";

// MXI Brand colors
const COLORS = {
  purple: "#883486",
  blue: "#4ea7f9",
  dark: "#1a1a2e",
  white: "#ffffff",
  gray: "#6b7280",
  lightGray: "#f3f4f6",
  red: "#dc2626",
  orange: "#ea580c",
  yellow: "#ca8a04",
  green: "#16a34a",
};

const LEVEL_COLORS: Record<number, string> = {
  0: COLORS.red,
  1: COLORS.orange,
  2: COLORS.yellow,
  3: COLORS.blue,
  4: COLORS.green,
};

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

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: "Helvetica",
    fontSize: 10,
    color: "#1a1a2e",
  },
  header: {
    backgroundColor: COLORS.dark,
    padding: 20,
    marginBottom: 20,
    marginTop: -40,
    marginLeft: -40,
    marginRight: -40,
  },
  headerTitle: {
    fontSize: 20,
    color: COLORS.white,
    fontFamily: "Helvetica-Bold",
  },
  headerSubtitle: {
    fontSize: 10,
    color: "#ffffff99",
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
    marginBottom: 8,
    marginTop: 16,
  },
  overallBox: {
    backgroundColor: COLORS.lightGray,
    padding: 16,
    borderRadius: 8,
    textAlign: "center",
    marginBottom: 16,
  },
  overallScore: {
    fontSize: 36,
    fontFamily: "Helvetica-Bold",
  },
  overallLabel: {
    fontSize: 12,
    color: COLORS.gray,
    marginTop: 4,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    color: COLORS.white,
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
  },
  table: {
    marginTop: 8,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: COLORS.dark,
    padding: 8,
  },
  tableHeaderCell: {
    color: COLORS.white,
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
  },
  tableRow: {
    flexDirection: "row",
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  tableRowHighlight: {
    backgroundColor: "#fef2f2",
  },
  tableCell: {
    fontSize: 9,
  },
  flagBox: {
    backgroundColor: "#fef2f2",
    borderWidth: 1,
    borderColor: "#fecaca",
    borderRadius: 6,
    padding: 12,
    marginTop: 8,
  },
  flagTitle: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: COLORS.red,
    marginBottom: 6,
  },
  flagItem: {
    flexDirection: "row",
    marginBottom: 4,
  },
  flagDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.red,
    marginTop: 3,
    marginRight: 6,
  },
  footer: {
    position: "absolute",
    bottom: 20,
    left: 40,
    right: 40,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    paddingTop: 8,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  footerText: {
    fontSize: 8,
    color: COLORS.gray,
  },
  disclaimer: {
    marginTop: 20,
    padding: 12,
    backgroundColor: COLORS.lightGray,
    borderRadius: 6,
  },
  disclaimerText: {
    fontSize: 8,
    color: COLORS.gray,
    lineHeight: 1.4,
  },
});

interface ScoreData {
  category: string;
  categoryName: string;
  avgScore: number;
  level: number;
  weight: number;
}

export interface ReportProps {
  assessmentType: AssessmentType;
  companyName: string;
  contactName: string;
  contactEmail: string;
  sector: string | null;
  overallScore: number;
  level: number;
  completedAt: string;
  scores: ScoreData[];
}

export function SovereigntyReport(props: ReportProps) {
  const {
    assessmentType,
    companyName,
    contactName,
    contactEmail,
    sector,
    overallScore,
    level,
    completedAt,
    scores,
  } = props;

  const isSra = assessmentType === "sra";
  const accentColor = isSra ? COLORS.blue : COLORS.purple;
  const levelLabels = isSra ? SRA_LABELS : SEAL_LABELS;
  const levelPrefix = isSra ? "SRA" : "SEAL";
  const trackTitle = isSra
    ? "Soevereiniteits Gereedheids Assessment"
    : "EU SEAL Framework Assessment";
  const itemLabel = isSra ? "Thema" : "Categorie";

  const criticalFlags = scores.filter((s) => s.level < 3);
  const completedDate = new Date(completedAt).toLocaleDateString("nl-NL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>
            {isSra ? "Gereedheidsrapport" : "Soevereiniteitsrapport"} — {companyName}
          </Text>
          <Text style={styles.headerSubtitle}>
            {trackTitle} | {completedDate} | MXI.nl
          </Text>
        </View>

        {/* Assessment info */}
        <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 16 }}>
          <View>
            <Text style={{ fontSize: 9, color: COLORS.gray }}>Organisatie</Text>
            <Text style={{ fontSize: 11, fontFamily: "Helvetica-Bold" }}>{companyName}</Text>
          </View>
          <View>
            <Text style={{ fontSize: 9, color: COLORS.gray }}>Contact</Text>
            <Text style={{ fontSize: 11 }}>{contactName}</Text>
          </View>
          <View>
            <Text style={{ fontSize: 9, color: COLORS.gray }}>E-mail</Text>
            <Text style={{ fontSize: 11 }}>{contactEmail}</Text>
          </View>
          {sector && (
            <View>
              <Text style={{ fontSize: 9, color: COLORS.gray }}>Sector</Text>
              <Text style={{ fontSize: 11 }}>{sector}</Text>
            </View>
          )}
        </View>

        {/* Overall Score */}
        <View style={styles.overallBox}>
          <Text style={[styles.overallScore, { color: accentColor }]}>
            {Math.round(overallScore)}%
          </Text>
          <View
            style={[
              styles.badge,
              {
                backgroundColor: LEVEL_COLORS[level] ?? COLORS.gray,
                alignSelf: "center",
                marginTop: 6,
              },
            ]}
          >
            <Text style={{ color: COLORS.white, fontSize: 10, fontFamily: "Helvetica-Bold" }}>
              {levelPrefix}-{level}
            </Text>
          </View>
          <Text style={styles.overallLabel}>
            {levelLabels[level] ?? "Onbekend"}
          </Text>
        </View>

        {/* Scores Table */}
        <Text style={[styles.sectionTitle, { color: accentColor }]}>
          Score per {itemLabel}
        </Text>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderCell, { width: "40%" }]}>{itemLabel}</Text>
            <Text style={[styles.tableHeaderCell, { width: "15%", textAlign: "center" }]}>Gewicht</Text>
            <Text style={[styles.tableHeaderCell, { width: "20%", textAlign: "center" }]}>Gem. Score</Text>
            <Text style={[styles.tableHeaderCell, { width: "25%", textAlign: "center" }]}>{levelPrefix} Level</Text>
          </View>
          {scores.map((s) => (
            <View
              key={s.category}
              style={[
                styles.tableRow,
                s.level < 3 ? styles.tableRowHighlight : {},
              ]}
            >
              <Text style={[styles.tableCell, { width: "40%" }]}>{s.categoryName}</Text>
              <Text style={[styles.tableCell, { width: "15%", textAlign: "center", color: COLORS.gray }]}>
                {Math.round(s.weight * 100)}%
              </Text>
              <Text style={[styles.tableCell, { width: "20%", textAlign: "center" }]}>
                {s.avgScore.toFixed(1)} / 4.0
              </Text>
              <View style={{ width: "25%", alignItems: "center" }}>
                <View
                  style={[
                    styles.badge,
                    { backgroundColor: LEVEL_COLORS[s.level] ?? COLORS.gray },
                  ]}
                >
                  <Text style={{ color: COLORS.white, fontSize: 8, fontFamily: "Helvetica-Bold" }}>
                    {levelPrefix}-{s.level}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Critical Flags */}
        {criticalFlags.length > 0 && (
          <View style={styles.flagBox}>
            <Text style={styles.flagTitle}>
              Aandachtspunten ({criticalFlags.length})
            </Text>
            <Text style={{ fontSize: 9, color: COLORS.gray, marginBottom: 8 }}>
              De volgende {isSra ? "thema's" : "categorieën"} scoren onder {levelPrefix}-3 en vereisen aandacht:
            </Text>
            {criticalFlags.map((f) => (
              <View key={f.category} style={styles.flagItem}>
                <View style={styles.flagDot} />
                <Text style={{ fontSize: 9 }}>
                  {f.categoryName} — {levelPrefix}-{f.level} (gem. {f.avgScore.toFixed(1)})
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Disclaimer */}
        <View style={styles.disclaimer}>
          <Text style={styles.disclaimerText}>
            {isSra
              ? "Dit rapport is gegenereerd op basis van een organisatiebrede zelfbeoordeling via het Soevereiniteits Gereedheids Assessment (SRA). De resultaten zijn indicatief en bieden een afwegingskader — geen formeel oordeel. Voor een uitgebreide deep-assessment kunt u contact opnemen met MXI via info@mxi.nl."
              : "Dit rapport is gegenereerd op basis van zelfbeoordeling via het EU SEAL Framework. De resultaten zijn indicatief en vervangen geen formele audit. Voor een uitgebreide deep-assessment kunt u contact opnemen met MXI via info@mxi.nl."}
          </Text>
        </View>

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>
            MXI.nl — Digitale soevereiniteit, inzichtelijk gemaakt
          </Text>
          <Text style={styles.footerText}>
            {trackTitle}
          </Text>
        </View>
      </Page>
    </Document>
  );
}
