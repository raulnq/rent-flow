import { paginationSchema } from '#/pagination.js';
import { z } from 'zod';

export const propertySchema = z.object({
  propertyId: z.uuidv7(),
  address: z.string().min(1).max(1000),
  propertyType: z.string().max(25),
  clientId: z.uuidv7(),
  rentalPrice: z.number().min(0).multipleOf(0.01),
  numberOfRooms: z.number().int().min(0),
  numberOfBathrooms: z.number().int().min(0),
  numberOfGarages: z.number().int().min(0),
  totalArea: z.number().min(0).multipleOf(0.01),
  description: z.string().max(5000).nullable(),
  constraints: z.string().max(5000).nullable(),
  latitude: z.number().min(-90).max(90).nullable(),
  longitude: z.number().min(-180).max(180).nullable(),
  clientName: z.string().max(200).nullable(),
});

export type Property = z.infer<typeof propertySchema>;

export const addPropertySchema = propertySchema.omit({
  propertyId: true,
  clientName: true,
});

export type AddProperty = z.infer<typeof addPropertySchema>;

export const editPropertySchema = propertySchema.omit({ clientName: true });

export type EditProperty = z.infer<typeof editPropertySchema>;

export const listPropertiesSchema = paginationSchema.extend({
  address: z.string().optional(),
});

export type ListProperties = z.infer<typeof listPropertiesSchema>;
