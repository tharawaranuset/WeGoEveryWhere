import { pgTable, uuid, integer, varchar, text, timestamp, boolean, index } from 'drizzle-orm/pg-core';
import { InferSelectModel, InferInsertModel } from 'drizzle-orm';

export const privacyPolicies = pgTable('privacy_policies', {
  id: uuid('id').primaryKey().defaultRandom(),
  version: integer('version').notNull().unique(),
  title: varchar('title', { length: 255 }).notNull(),
  content: text('content').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  effectiveDate: timestamp('effective_date').notNull(),
  isActive: boolean('is_active').default(false).notNull(),
  createdBy: uuid('created_by').notNull(),
}, (table) => ({
  versionIdx: index('privacy_policies_version_idx').on(table.version),
  activeIdx: index('privacy_policies_active_idx').on(table.isActive),
}));

export type PrivacyPolicy = InferSelectModel<typeof privacyPolicies>;
export type InsertPrivacyPolicy = InferInsertModel<typeof privacyPolicies>;