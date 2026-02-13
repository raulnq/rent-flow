import { varchar, pgSchema, uuid, timestamp, text } from 'drizzle-orm/pg-core';
import { applications } from '#/features/applications/application.js';
import type { InferSelectModel } from 'drizzle-orm/table';

const dbSchema = pgSchema('rent_flow');

export const visits = dbSchema.table('visits', {
  visitId: uuid('visitId').primaryKey(),
  applicationId: uuid('applicationId')
    .notNull()
    .references(() => applications.applicationId),
  status: varchar('status', { length: 25 }).notNull(),
  scheduledAt: timestamp('scheduledAt', {
    mode: 'date',
    withTimezone: true,
  }).notNull(),
  notes: text('notes'),
  cancellationReason: text('cancellationReason'),
  createdAt: timestamp('createdAt', {
    mode: 'date',
    withTimezone: true,
  })
    .notNull()
    .defaultNow(),
});

export type Visit = InferSelectModel<typeof visits>;
