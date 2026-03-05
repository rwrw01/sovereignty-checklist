import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Svg,
  Polygon,
  Line,
  Circle,
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
  page2: {
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
  explainerBox: {
    marginTop: 16,
    padding: 12,
    backgroundColor: "#eff6ff",
    borderWidth: 1,
    borderColor: "#bfdbfe",
    borderRadius: 6,
  },
  explainerTitle: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: COLORS.dark,
    marginBottom: 6,
  },
  explainerText: {
    fontSize: 8,
    color: "#374151",
    lineHeight: 1.5,
    marginBottom: 4,
  },
  explainerBullet: {
    fontSize: 8,
    color: "#374151",
    lineHeight: 1.5,
    paddingLeft: 8,
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

/** Generate polygon points for a radar chart */
function radarPoints(
  scores: number[],
  cx: number,
  cy: number,
  radius: number,
  maxVal: number,
): string {
  const n = scores.length;
  return scores
    .map((score, i) => {
      const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
      const r = (score / maxVal) * radius;
      const x = cx + r * Math.cos(angle);
      const y = cy + r * Math.sin(angle);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
}

/** PDF Radar Chart Component */
function PdfRadarChart({
  scores,
  color,
  labels,
}: {
  scores: number[];
  color: string;
  labels: string[];
}) {
  const size = 220;
  const cx = size / 2;
  const cy = size / 2;
  const radius = 85;
  const n = scores.length;
  const levels = [1, 2, 3, 4];

  return (
    <View style={{ alignItems: "center", marginVertical: 8 }}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Background grid polygons */}
        {levels.map((lvl) => (
          <Polygon
            key={`grid-${lvl}`}
            points={radarPoints(
              Array(n).fill(lvl),
              cx,
              cy,
              radius,
              4,
            )}
            stroke="#e5e7eb"
            strokeWidth={0.5}
            fill="none"
          />
        ))}

        {/* Axis lines */}
        {scores.map((_, i) => {
          const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
          const x2 = cx + radius * Math.cos(angle);
          const y2 = cy + radius * Math.sin(angle);
          return (
            <Line
              key={`axis-${i}`}
              x1={String(cx)}
              y1={String(cy)}
              x2={String(x2.toFixed(1))}
              y2={String(y2.toFixed(1))}
              stroke="#d1d5db"
              strokeWidth={0.5}
            />
          );
        })}

        {/* Score polygon */}
        <Polygon
          points={radarPoints(scores, cx, cy, radius, 4)}
          stroke={color}
          strokeWidth={1.5}
          fill={color}
          opacity={0.3}
        />

        {/* Score dots */}
        {scores.map((score, i) => {
          const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
          const r = (score / 4) * radius;
          const x = cx + r * Math.cos(angle);
          const y = cy + r * Math.sin(angle);
          return (
            <Circle
              key={`dot-${i}`}
              cx={String(x.toFixed(1))}
              cy={String(y.toFixed(1))}
              r="3"
              fill={color}
            />
          );
        })}
      </Svg>

      {/* Labels below the chart */}
      <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "center", marginTop: 4, maxWidth: 400 }}>
        {labels.map((label, i) => (
          <Text key={i} style={{ fontSize: 7, color: COLORS.gray, marginHorizontal: 4, marginVertical: 1 }}>
            {i + 1}. {label}
          </Text>
        ))}
      </View>
    </View>
  );
}

const SEAL3_EXPLANATION = {
  title: "Waarom SEAL-3 als minimum?",
  intro: 'SEAL-3 ("Grotendeels Soeverein") is het niveau waarbij een organisatie aantoonbare controle heeft over haar digitale infrastructuur binnen EU-jurisdictie. Onder dit niveau bestaan risico\'s op:',
  bullets: [
    "Extraterritoriale wetgeving (CLOUD Act, FISA 702) die toegang tot data kan afdwingen",
    "Eenzijdige wijzigingen door niet-EU partijen in service-voorwaarden",
    "Beperkte portabiliteit waardoor vendor lock-in ontstaat",
    "Onvoldoende transparantie over dataverwerking en governance",
  ],
  conclusion: "Het EU SEAL Framework stelt SEAL-3 als drempel voor overheden en gereguleerde sectoren. Een bewuste keuze met mitigatie is beter dan onbewuste afhankelijkheid \u2014 maar die keuze vereist minimaal SEAL-3 inzicht.",
};

const SRA3_EXPLANATION = {
  title: "Waarom SRA-3 als minimum?",
  intro: 'SRA-3 ("Goed Voorbereid") is het niveau waarbij een organisatie structureel voorbereid is op digitale soevereiniteitsrisico\'s. Onder dit niveau mist de organisatie:',
  bullets: [
    "Gestructureerd beleid voor digitale soevereiniteit en afhankelijkheden",
    "Inzicht in verborgen afhankelijkheden van niet-EU leveranciers",
    "Adequate incident preparedness voor leveranciersuitval",
    "Aansluiting bij regelgeving zoals NIS2, DORA en de European Data Act",
  ],
  conclusion: "Het SRA framework is gebaseerd op Nederlandse onderzoeken naar digitale afhankelijkheden. SRA-3 vormt de basis voor verantwoorde digitale keuzes.",
};

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

  const explanation = isSra ? SRA3_EXPLANATION : SEAL3_EXPLANATION;

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

        {/* Radar Chart */}
        <Text style={[styles.sectionTitle, { color: accentColor }]}>
          {isSra ? "Score per Thema" : "Soevereiniteit per Categorie"}
        </Text>
        <PdfRadarChart
          scores={scores.map((s) => s.avgScore)}
          color={accentColor}
          labels={scores.map((s) => s.categoryName)}
        />

        {/* Scores Table */}
        <Text style={[styles.sectionTitle, { color: accentColor, marginTop: 8 }]}>
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

        {/* Footer page 1 */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>
            MXI.nl — Digitale soevereiniteit, inzichtelijk gemaakt
          </Text>
          <Text style={styles.footerText}>
            {trackTitle}
          </Text>
        </View>
      </Page>

      {/* Page 2: Flags + Explanation + Disclaimer */}
      <Page size="A4" style={styles.page2}>
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

        {/* SEAL-3 / SRA-3 Explanation */}
        <View style={styles.explainerBox}>
          <Text style={styles.explainerTitle}>{explanation.title}</Text>
          <Text style={styles.explainerText}>{explanation.intro}</Text>
          {explanation.bullets.map((bullet, i) => (
            <Text key={i} style={styles.explainerBullet}>
              {"\u2022"} {bullet}
            </Text>
          ))}
          <Text style={[styles.explainerText, { marginTop: 6 }]}>{explanation.conclusion}</Text>
        </View>

        {/* Disclaimer */}
        <View style={styles.disclaimer}>
          <Text style={styles.disclaimerText}>
            {isSra
              ? "Dit rapport is gegenereerd op basis van een organisatiebrede zelfbeoordeling via het Soevereiniteits Gereedheids Assessment (SRA). De resultaten zijn indicatief en bieden een afwegingskader \u2014 geen formeel oordeel. Voor een uitgebreide deep-assessment kunt u contact opnemen met MXI via info@mxi.nl."
              : "Dit rapport is gegenereerd op basis van zelfbeoordeling via het EU SEAL Framework. De resultaten zijn indicatief en vervangen geen formele audit. Voor een uitgebreide deep-assessment kunt u contact opnemen met MXI via info@mxi.nl."}
          </Text>
        </View>

        {/* Footer page 2 */}
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
