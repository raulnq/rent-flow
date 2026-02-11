import { varchar, pgSchema, uuid, date, text } from 'drizzle-orm/pg-core';

const dbSchema = pgSchema('rent_flow');

export const leads = dbSchema.table('leads', {
  leadId: uuid('leadId').primaryKey(),
  name: varchar('name', { length: 200 }).notNull(),
  dni: varchar('dni', { length: 20 }).notNull().unique(),
  phone: varchar('phone', { length: 20 }).notNull(),
  email: varchar('email', { length: 100 }),
  address: varchar('address', { length: 1000 }),
  birthDate: date('birthDate', { mode: 'string' }),
  occupation: varchar('occupation', { length: 100 }),
  notes: text('notes'),
  nationality: varchar('nationality', { length: 50 }),
});
