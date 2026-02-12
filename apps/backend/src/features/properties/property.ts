import {
  varchar,
  pgSchema,
  uuid,
  integer,
  numeric,
  doublePrecision,
  text,
  boolean,
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
  rooms: integer('rooms').notNull(),
  bathrooms: integer('bathrooms').notNull(),
  parkingSpaces: integer('parkingSpaces').notNull(),
  totalArea: numeric('totalArea', {
    precision: 10,
    scale: 2,
    mode: 'number',
  }).notNull(),
  builtArea: numeric('builtArea', {
    precision: 10,
    scale: 2,
    mode: 'number',
  }).notNull(),
  floorNumber: integer('floorNumber').notNull(),
  yearBuilt: integer('yearBuilt').notNull(),
  description: text('description'),
  notes: text('notes'),
  latitude: doublePrecision('latitude'),
  longitude: doublePrecision('longitude'),
  maintenanceFee: numeric('maintenanceFee', {
    precision: 10,
    scale: 2,
    mode: 'number',
  }).notNull(),
  minimumContractMonths: integer('minimumContractMonths').notNull(),
  depositMonths: integer('depositMonths').notNull(),
  hasElevator: boolean('hasElevator').notNull(),
  allowPets: boolean('allowPets').notNull(),
  allowKids: boolean('allowKids').notNull(),
  status: varchar('status', { length: 25 }).notNull(),
});

export type Property = InferSelectModel<typeof properties>;
