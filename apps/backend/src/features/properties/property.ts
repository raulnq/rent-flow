import {
  varchar,
  pgSchema,
  uuid,
  integer,
  numeric,
  doublePrecision,
} from 'drizzle-orm/pg-core';
import { clients } from '#/features/clients/client.js';
import type { InferSelectModel } from 'drizzle-orm';

const dbSchema = pgSchema('rent_flow');

export const properties = dbSchema.table('properties', {
  propertyId: uuid('propertyId').primaryKey(),
  address: varchar('address', { length: 1000 }).notNull(),
  propertyType: varchar('propertyType', { length: 25 }).notNull(),
  clientId: uuid('clientId')
    .notNull()
    .references(() => clients.clientId),
  rentalPrice: numeric('rentalPrice', {
    precision: 10,
    scale: 2,
    mode: 'number',
  }).notNull(),
  numberOfRooms: integer('numberOfRooms').notNull(),
  numberOfBathrooms: integer('numberOfBathrooms').notNull(),
  numberOfGarages: integer('numberOfGarages').notNull(),
  totalArea: numeric('totalArea', {
    precision: 10,
    scale: 2,
    mode: 'number',
  }).notNull(),
  description: varchar('description', { length: 5000 }),
  constraints: varchar('constraints', { length: 5000 }),
  latitude: doublePrecision('latitude'),
  longitude: doublePrecision('longitude'),
});

export type Property = InferSelectModel<typeof properties>;
