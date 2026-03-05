import type {
  SraAnswer,
  SraCriticalFlag,
  SraLevel,
  SraResult,
  SraTheme,
  SraThemeScore,
} from './types';
import { SRA_THEMES, SRA_WEIGHTS } from './weights';

/** Calculate the average score for a single SRA theme */
export function calculateThemeScore(
  answers: SraAnswer[],
  theme: SraTheme,
): number {
  const themeAnswers = answers.filter((a) =>
    a.questionId.startsWith(theme),
  );
  if (themeAnswers.length === 0) return 0;
  const sum = themeAnswers.reduce((acc, a) => acc + a.score, 0);
  return sum / themeAnswers.length;
}

/** Convert a raw average score (0-4) to a discrete SRA maturity level */
export function toSraLevel(score: number): SraLevel {
  if (score < 0.5) return 0;
  if (score < 1.5) return 1;
  if (score < 2.5) return 2;
  if (score < 3.5) return 3;
  return 4;
}

/** Calculate the weighted overall SRA score as a percentage (0-100) */
export function calculateOverallSraScore(
  themeScores: Record<SraTheme, number>,
): number {
  let weighted = 0;
  for (const theme of SRA_THEMES) {
    const score = themeScores[theme] ?? 0;
    const weight = SRA_WEIGHTS[theme].weight;
    weighted += score * weight;
  }
  return (weighted / 4) * 100;
}

/**
 * Detect critical flags based on SRA scores.
 * Flags are linked to real Dutch investigation findings.
 */
export function detectSraCriticalFlags(
  themeScores: Record<SraTheme, number>,
  sector?: string,
): SraCriticalFlag[] {
  const flags: SraCriticalFlag[] = [];

  for (const theme of SRA_THEMES) {
    const score = themeScores[theme] ?? 0;
    const config = SRA_WEIGHTS[theme];

    // Any theme <= 1.0 is critical
    if (score <= 1.0) {
      flags.push({
        theme,
        themeName: config.nameNl,
        avgScore: score,
        severity: 'critical',
        message: `${config.nameNl} scoort kritiek laag (${score.toFixed(1)}/4.0)`,
      });
    }
  }

  // Special flags linked to investigation findings
  const risicoScore = themeScores.risicoanalyse ?? 0;
  if (risicoScore <= 1.5 && !flags.some((f) => f.theme === 'risicoanalyse')) {
    flags.push({
      theme: 'risicoanalyse',
      themeName: SRA_WEIGHTS.risicoanalyse.nameNl,
      avgScore: risicoScore,
      severity: 'critical',
      message: 'Afwegingskader ontbreekt — dit was het kernprobleem bij Solvinity, SIDN en Belastingdienst/M365',
      reference: 'Rekenkamer: 67% van kritieke diensten zonder risicoanalyse',
    });
  }

  const incidentScore = themeScores.incident ?? 0;
  if (incidentScore <= 1.0 && !flags.some((f) => f.theme === 'incident')) {
    flags.push({
      theme: 'incident',
      themeName: SRA_WEIGHTS.incident.nameNl,
      avgScore: incidentScore,
      severity: 'critical',
      message: 'Niet voorbereid op soevereiniteitsincident — vergelijkbaar met Solvinity-situatie',
      reference: 'Solvinity/Kyndryl: geen detectie-, escalatie- of crisisplan',
    });
  }

  // Sector-specific flags
  if (sector === 'zorg') {
    const complianceScore = themeScores.compliance ?? 0;
    if (complianceScore <= 1.5) {
      flags.push({
        theme: 'compliance',
        themeName: SRA_WEIGHTS.compliance.nameNl,
        avgScore: complianceScore,
        severity: 'critical',
        message: 'NEN 7510 / NIS2 compliance risico — zorginstellingen vallen onder strengere verplichtingen',
        reference: 'NEN 7510:2024 + Cbw: essentiële entiteit',
      });
    }
  }

  // Warning-level flags
  const afhankelijkhedenScore = themeScores.afhankelijkheden ?? 0;
  if (afhankelijkhedenScore <= 1.5 && !flags.some((f) => f.theme === 'afhankelijkheden')) {
    flags.push({
      theme: 'afhankelijkheden',
      themeName: SRA_WEIGHTS.afhankelijkheden.nameNl,
      avgScore: afhankelijkhedenScore,
      severity: 'warning',
      message: 'Onvoldoende inzicht in verborgen afhankelijkheden (identity, DNS, PKI)',
      reference: 'SIDN: DNS-keten afhankelijkheid pas achteraf geïdentificeerd',
    });
  }

  const leveranciersScore = themeScores.leveranciers ?? 0;
  if (leveranciersScore <= 1.5 && !flags.some((f) => f.theme === 'leveranciers')) {
    flags.push({
      theme: 'leveranciers',
      themeName: SRA_WEIGHTS.leveranciers.nameNl,
      avgScore: leveranciersScore,
      severity: 'warning',
      message: 'Onvoldoende grip op leverancierslandschap — geen exit-strategieën of contractuele waarborgen',
      reference: 'Rekenkamer: 1.588 clouddiensten zonder coördinatie',
    });
  }

  return flags;
}

/**
 * Calculate the full SRA assessment result.
 * Main entry point for the SRA calculation engine.
 */
export function calculateSraAssessment(
  answers: SraAnswer[],
  sector?: string,
): SraResult {
  const themeScoreMap = {} as Record<SraTheme, number>;
  const themeScores: SraThemeScore[] = [];

  for (const theme of SRA_THEMES) {
    const avgScore = calculateThemeScore(answers, theme);
    themeScoreMap[theme] = avgScore;
    themeScores.push({
      theme,
      avgScore,
      sraLevel: toSraLevel(avgScore),
    });
  }

  const overallScore = calculateOverallSraScore(themeScoreMap);
  const overallSraLevel = toSraLevel((overallScore / 100) * 4);
  const criticalFlags = detectSraCriticalFlags(themeScoreMap, sector);

  return {
    overallScore,
    overallSraLevel,
    themeScores,
    criticalFlags,
  };
}
