/** SRA Maturity Level: 0 = Unaware, 4 = Optimized */
export type SraLevel = 0 | 1 | 2 | 3 | 4;

export type SraTheme =
  | 'bewustzijn'
  | 'governance'
  | 'risicoanalyse'
  | 'afhankelijkheden'
  | 'communicatie'
  | 'leveranciers'
  | 'incident'
  | 'compliance'
  | 'monitoring';

export interface SraWeight {
  readonly name: string;
  readonly nameNl: string;
  readonly weight: number;
}

export interface SraAnswer {
  questionId: string;
  score: SraLevel;
  notes?: string;
}

export interface SraThemeScore {
  theme: SraTheme;
  avgScore: number;
  sraLevel: SraLevel;
}

export interface SraResult {
  overallScore: number; // 0-100 percentage
  overallSraLevel: SraLevel;
  themeScores: SraThemeScore[];
  criticalFlags: SraCriticalFlag[];
}

export interface SraCriticalFlag {
  theme: SraTheme;
  themeName: string;
  avgScore: number;
  severity: 'critical' | 'warning';
  message: string;
  reference?: string;
}

export interface SraLevelDescription {
  level: SraLevel;
  description: string;
}

export interface SraQuestion {
  id: string;
  theme: SraTheme;
  question: string;
  context: string; // Why this matters — linked to investigation findings
  levels: SraLevelDescription[];
}
