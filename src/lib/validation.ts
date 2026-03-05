import { z } from 'zod';

/** Valid assessment types */
export const assessmentTypes = ['seal', 'sra'] as const;
export type AssessmentType = (typeof assessmentTypes)[number];

/** Schema for creating a new assessment */
export const createAssessmentSchema = z.object({
  assessmentType: z.enum(assessmentTypes, {
    message: 'Kies een assessment type (seal of sra)',
  }),
  companyName: z
    .string()
    .min(2, 'Bedrijfsnaam is verplicht (minimaal 2 tekens)')
    .max(200, 'Bedrijfsnaam mag maximaal 200 tekens zijn')
    .trim(),
  contactName: z
    .string()
    .min(2, 'Contactpersoon is verplicht (minimaal 2 tekens)')
    .max(200, 'Naam mag maximaal 200 tekens zijn')
    .trim(),
  contactEmail: z
    .string()
    .email('Ongeldig e-mailadres')
    .max(254, 'E-mailadres te lang')
    .trim()
    .toLowerCase(),
  contactPhone: z
    .string()
    .max(20, 'Telefoonnummer te lang')
    .trim()
    .optional()
    .or(z.literal('')),
  sector: z
    .enum([
      'overheid',
      'zorg',
      'finance',
      'onderwijs',
      'energie',
      'telecom',
      'transport',
      'overig',
    ])
    .optional(),
});

/** SEAL question IDs: sov1_q1 through sov8_q4 */
const sealQuestionIdPattern = /^sov[1-8]_q[1-4]$/;

/** SRA question IDs: {theme}_q1 through {theme}_q4 */
const sraQuestionIdPattern = /^(bewustzijn|governance|risicoanalyse|afhankelijkheden|communicatie|leveranciers|incident|compliance|monitoring)_q[1-4]$/;

/** Schema for submitting answers (supports both SEAL and SRA question IDs) */
export const submitAnswersSchema = z.object({
  answers: z
    .array(
      z.object({
        questionId: z
          .string()
          .refine(
            (id) => sealQuestionIdPattern.test(id) || sraQuestionIdPattern.test(id),
            'Ongeldig vraag-ID',
          ),
        score: z
          .number()
          .int()
          .min(0, 'Score moet minimaal 0 zijn')
          .max(4, 'Score mag maximaal 4 zijn'),
        notes: z
          .string()
          .max(1000, 'Notitie mag maximaal 1000 tekens zijn')
          .trim()
          .optional()
          .or(z.literal('')),
      }),
    )
    .min(1, 'Minimaal 1 antwoord vereist')
    .max(36, 'Maximaal 36 antwoorden per keer'),
});

/** Schema for admin login */
export const adminLoginSchema = z.object({
  username: z
    .string()
    .min(3, 'Gebruikersnaam minimaal 3 tekens')
    .max(50, 'Gebruikersnaam maximaal 50 tekens')
    .trim(),
  password: z
    .string()
    .min(12, 'Wachtwoord minimaal 12 tekens')
    .max(128, 'Wachtwoord maximaal 128 tekens'),
});

/** UUIDv4 token validation */
export const tokenSchema = z
  .string()
  .uuid('Ongeldig assessment token');

/** Schema for user registration */
export const userRegistrationSchema = z.object({
  email: z
    .string()
    .email('Ongeldig e-mailadres')
    .max(254, 'E-mailadres te lang')
    .trim()
    .toLowerCase(),
  name: z
    .string()
    .min(2, 'Naam is verplicht (minimaal 2 tekens)')
    .max(200, 'Naam mag maximaal 200 tekens zijn')
    .trim(),
  password: z
    .string()
    .min(12, 'Wachtwoord minimaal 12 tekens')
    .max(128, 'Wachtwoord maximaal 128 tekens'),
});

/** Schema for user login */
export const userLoginSchema = z.object({
  email: z
    .string()
    .email('Ongeldig e-mailadres')
    .max(254, 'E-mailadres te lang')
    .trim()
    .toLowerCase(),
  password: z
    .string()
    .min(12, 'Wachtwoord minimaal 12 tekens')
    .max(128, 'Wachtwoord maximaal 128 tekens'),
});

/** Schema for creating assessment as logged-in user (simplified) */
export const createUserAssessmentSchema = z.object({
  assessmentType: z.enum(assessmentTypes, {
    message: 'Kies een assessment type (seal of sra)',
  }),
});

export type CreateAssessmentInput = z.infer<typeof createAssessmentSchema>;
export type SubmitAnswersInput = z.infer<typeof submitAnswersSchema>;
export type AdminLoginInput = z.infer<typeof adminLoginSchema>;
export type UserRegistrationInput = z.infer<typeof userRegistrationSchema>;
export type UserLoginInput = z.infer<typeof userLoginSchema>;
export type CreateUserAssessmentInput = z.infer<typeof createUserAssessmentSchema>;
