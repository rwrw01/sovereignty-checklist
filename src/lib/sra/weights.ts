import type { SraTheme, SraWeight } from './types';

/**
 * SRA Theme weights.
 * Risicoanalyse & Afwegingskader has highest weight (0.18) —
 * this was THE key gap found across all Dutch investigations.
 * Sum of all weights = 1.0
 */
export const SRA_WEIGHTS: Record<SraTheme, SraWeight> = {
  bewustzijn: {
    name: 'Awareness & Strategy',
    nameNl: 'Bewustzijn & Strategie',
    weight: 0.12,
  },
  governance: {
    name: 'Policy Framework & Governance',
    nameNl: 'Beleidskader & Governance',
    weight: 0.14,
  },
  risicoanalyse: {
    name: 'Risk Analysis & Deliberation Framework',
    nameNl: 'Risicoanalyse & Afwegingskader',
    weight: 0.18,
  },
  afhankelijkheden: {
    name: 'Dependency Landscape',
    nameNl: 'Afhankelijkheidslandschap',
    weight: 0.14,
  },
  communicatie: {
    name: 'Stakeholder Communication & Accountability',
    nameNl: 'Stakeholder Communicatie & Verantwoording',
    weight: 0.08,
  },
  leveranciers: {
    name: 'Vendor Management & Contract Governance',
    nameNl: 'Leveranciersmanagement & Contracten',
    weight: 0.14,
  },
  incident: {
    name: 'Incident Preparedness & Crisis Management',
    nameNl: 'Incident Preparedness & Crisisbeheersing',
    weight: 0.08,
  },
  compliance: {
    name: 'Legal & Regulatory Compliance',
    nameNl: 'Wet- & Regelgeving Compliance',
    weight: 0.08,
  },
  monitoring: {
    name: 'Monitoring & Continuous Improvement',
    nameNl: 'Monitoring & Continue Verbetering',
    weight: 0.04,
  },
} as const;

/** All SRA themes in order */
export const SRA_THEMES: SraTheme[] = [
  'bewustzijn',
  'governance',
  'risicoanalyse',
  'afhankelijkheden',
  'communicatie',
  'leveranciers',
  'incident',
  'compliance',
  'monitoring',
];
