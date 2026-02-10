import { varchar, pgSchema, uuid } from 'drizzle-orm/pg-core';

const dbSchema = pgSchema('rent_flow');

export const clients = dbSchema.table('clients', {
  clientId: uuid('clientId').primaryKey(),
  name: varchar('name', { length: 200 }).notNull(),
  dni: varchar('dni', { length: 20 }).notNull().unique(),
  phone: varchar('phone', { length: 20 }).notNull(),
  email: varchar('email', { length: 100 }),
  address: varchar('address', { length: 1000 }),
});
