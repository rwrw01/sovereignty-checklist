export {
  calculateSovScore,
  calculateOverallScore,
  calculateAssessment,
  toSealLevel,
  detectCriticalFlags,
} from './engine';
export { SOV_WEIGHTS, SOV_CATEGORIES } from './weights';
export { QUESTIONS, getQuestionsByCategory, TOTAL_QUESTIONS } from './questions';
export type {
  SealLevel,
  SovCategory,
  SovWeight,
  Answer,
  SovScore,
  AssessmentResult,
  CriticalFlag,
  SealLevelDescription,
  Question,
} from './types';
