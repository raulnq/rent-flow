import { varchar, pgSchema, uuid, timestamp, text } from 'drizzle-orm/pg-core';
import { applications } from '#/features/applications/application.js';
import type { InferSelectModel } from 'drizzle-orm/table';

const dbSchema = pgSchema('rent_flow');

export const applicationDocuments = dbSchema.table('applicationDocuments', {
  applicationDocumentId: uuid('applicationDocumentId').primaryKey(),
  applicationId: uuid('applicationId')
    .notNull()
    .references(() => applications.applicationId),
  fileName: varchar('fileName', { length: 250 }).notNull(),
  contentType: varchar('contentType', { length: 100 }).notNull(),
  filePath: varchar('filePath', { length: 500 }).notNull(),
  documentType: varchar('documentType', { length: 250 }).notNull(),
  notes: text('notes'),
  createdAt: timestamp('createdAt', {
    mode: 'date',
    withTimezone: true,
  })
    .notNull()
    .defaultNow(),
});

export type ApplicationDocument = InferSelectModel<typeof applicationDocuments>;
