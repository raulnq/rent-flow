import { varchar, pgSchema, uuid, timestamp } from 'drizzle-orm/pg-core';
import { properties } from '#/features/properties/property.js';
import type { InferSelectModel } from 'drizzle-orm';

const dbSchema = pgSchema('rent_flow');

export const propertyImages = dbSchema.table('propertyImages', {
  propertyImageId: uuid('propertyImageId').primaryKey(),
  imageName: varchar('imageName', { length: 250 }).notNull(),
  contentType: varchar('contentType', { length: 100 }).notNull(),
  imagePath: varchar('imagePath', { length: 500 }).notNull(),
  createdAt: timestamp('createdAt', {
    mode: 'date',
    withTimezone: true,
  })
    .notNull()
    .defaultNow(),
  propertyId: uuid('propertyId')
    .notNull()
    .references(() => properties.propertyId),
});

export type PropertyImage = InferSelectModel<typeof propertyImages>;
