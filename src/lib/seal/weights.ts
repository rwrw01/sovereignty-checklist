import type { SovCategory, SovWeight } from './types';

/**
 * EU SEAL Framework SOV weights (October 2025).
 * Source: European Commission Cloud Sovereignty Framework.
 * Sum of all weights = 1.0
 */
export const SOV_WEIGHTS: Record<SovCategory, SovWeight> = {
  sov1: {
    name: 'Strategic Sovereignty',
    nameNl: 'Strategische Soevereiniteit',
    weight: 0.15,
  },
  sov2: {
    name: 'Legal & Jurisdictional',
    nameNl: 'Juridisch & Jurisdictie',
    weight: 0.10,
  },
  sov3: {
    name: 'Data & AI Sovereignty',
    nameNl: 'Data & AI Soevereiniteit',
    weight: 0.10,
  },
  sov4: {
    name: 'Operational Sovereignty',
    nameNl: 'Operationele Soevereiniteit',
    weight: 0.15,
  },
  sov5: {
    name: 'Supply Chain',
    nameNl: 'Supply Chain Soevereiniteit',
    weight: 0.20,
  },
  sov6: {
    name: 'Technology & Openness',
    nameNl: 'Technologie & Openheid',
    weight: 0.15,
  },
  sov7: {
    name: 'Security & Compliance',
    nameNl: 'Security & Compliance',
    weight: 0.10,
  },
  sov8: {
    name: 'Sustainability',
    nameNl: 'Duurzaamheid',
    weight: 0.05,
  },
} as const;

/** All SOV categories in order */
export const SOV_CATEGORIES: SovCategory[] = [
  'sov1', 'sov2', 'sov3', 'sov4', 'sov5', 'sov6', 'sov7', 'sov8',
];
