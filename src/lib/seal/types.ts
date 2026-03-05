/** SEAL Level: 0 = No Sovereignty, 4 = Full Digital Sovereignty */
export type SealLevel = 0 | 1 | 2 | 3 | 4;

export type SovCategory =
  | 'sov1'
  | 'sov2'
  | 'sov3'
  | 'sov4'
  | 'sov5'
  | 'sov6'
  | 'sov7'
  | 'sov8';

export interface SovWeight {
  readonly name: string;
  readonly nameNl: string;
  readonly weight: number;
}

export interface Answer {
  questionId: string;
  score: SealLevel;
  notes?: string;
}

export interface SovScore {
  category: SovCategory;
  avgScore: number;
  sealLevel: SealLevel;
}

export interface AssessmentResult {
  overallScore: number; // 0-100 percentage
  overallSealLevel: SealLevel;
  sovScores: SovScore[];
  criticalFlags: CriticalFlag[];
}

export interface CriticalFlag {
  category: SovCategory;
  categoryName: string;
  avgScore: number;
  message: string;
}

export interface SealLevelDescription {
  level: SealLevel;
  label: string;
  description: string;
}

export interface Question {
  id: string;
  category: SovCategory;
  question: string;
  levels: SealLevelDescription[];
}
