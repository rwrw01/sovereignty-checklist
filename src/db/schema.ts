import { sql } from 'drizzle-orm';
import { sqliteTable, text, integer, real, uniqueIndex, index } from 'drizzle-orm/sqlite-core';

export const assessments = sqliteTable('assessments', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  token: text('token').notNull().unique(),
  assessmentType: text('assessment_type', { enum: ['seal', 'sra'] })
    .notNull()
    .default('seal'),
  companyName: text('company_name').notNull(),
  contactName: text('contact_name').notNull(),
  contactEmail: text('contact_email').notNull(),
  contactPhone: text('contact_phone'),
  sector: text('sector'),
  overallScore: real('overall_score'),
  sealLevel: integer('seal_level'),
  status: text('status', { enum: ['draft', 'in_progress', 'completed'] })
    .notNull()
    .default('draft'),
  createdAt: text('created_at')
    .notNull()
    .default(sql`(datetime('now'))`),
  updatedAt: text('updated_at')
    .notNull()
    .default(sql`(datetime('now'))`),
  completedAt: text('completed_at'),
}, (table) => [
  index('idx_assessments_status').on(table.status),
  index('idx_assessments_type').on(table.assessmentType),
]);

export const answers = sqliteTable('answers', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  assessmentId: integer('assessment_id')
    .notNull()
    .references(() => assessments.id, { onDelete: 'cascade' }),
  questionId: text('question_id').notNull(),
  score: integer('score').notNull(),
  notes: text('notes'),
  createdAt: text('created_at')
    .notNull()
    .default(sql`(datetime('now'))`),
}, (table) => [
  uniqueIndex('idx_answers_unique').on(table.assessmentId, table.questionId),
  index('idx_answers_assessment').on(table.assessmentId),
]);

export const sovScores = sqliteTable('sov_scores', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  assessmentId: integer('assessment_id')
    .notNull()
    .references(() => assessments.id, { onDelete: 'cascade' }),
  sovCategory: text('sov_category').notNull(),
  avgScore: real('avg_score').notNull(),
  sealLevel: integer('seal_level').notNull(),
}, (table) => [
  uniqueIndex('idx_sov_scores_unique').on(table.assessmentId, table.sovCategory),
]);

export const sraScores = sqliteTable('sra_scores', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  assessmentId: integer('assessment_id')
    .notNull()
    .references(() => assessments.id, { onDelete: 'cascade' }),
  theme: text('theme').notNull(),
  avgScore: real('avg_score').notNull(),
  sraLevel: integer('sra_level').notNull(),
}, (table) => [
  uniqueIndex('idx_sra_scores_unique').on(table.assessmentId, table.theme),
]);

export const adminUsers = sqliteTable('admin_users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  username: text('username').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  createdAt: text('created_at')
    .notNull()
    .default(sql`(datetime('now'))`),
});
