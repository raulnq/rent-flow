import {
  varchar,
  pgSchema,
  uuid,
  timestamp,
  date,
  text,
  numeric,
} from 'drizzle-orm/pg-core';
import { leads } from '#/features/leads/lead.js';
import { properties } from '#/features/properties/property.js';
import type { InferSelectModel } from 'drizzle-orm/table';

const dbSchema = pgSchema('rent_flow');

export const applications = dbSchema.table('applications', {
  applicationId: uuid('applicationId').primaryKey(),
  leadId: uuid('leadId')
    .notNull()
    .references(() => leads.leadId),
  propertyId: uuid('propertyId')
    .notNull()
    .references(() => properties.propertyId),
  status: varchar('status', { length: 25 }).notNull(),
  notes: text('notes'),
  createdAt: timestamp('createdAt', {
    mode: 'date',
    withTimezone: true,
  })
    .notNull()
    .defaultNow(),
  reviewStartedAt: date('reviewStartedAt', { mode: 'string' }),
  approvedAt: date('approvedAt', { mode: 'string' }),
  rejectedAt: date('rejectedAt', { mode: 'string' }),
  rejectedReason: text('rejectedReason'),
  withdrawnAt: date('withdrawnAt', { mode: 'string' }),
  withdrawnReason: text('withdrawnReason'),
  contractSignedAt: date('contractSignedAt', { mode: 'string' }),
  reservedAt: date('reservedAt', { mode: 'string' }),
  reservedAmount: numeric('reservedAmount', {
    precision: 10,
    scale: 2,
    mode: 'number',
  }),
});

export type Application = InferSelectModel<typeof applications>;
