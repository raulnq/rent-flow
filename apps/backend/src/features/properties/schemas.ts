import { paginationSchema } from '#/pagination.js';
import { z } from 'zod';

export const propertySchema = z.object({
  propertyId: z.uuidv7(),
  address: z.string().min(1).max(1000),
  propertyType: z.string().max(25),
  clientId: z.uuidv7(),
  rentalPrice: z.number().min(0).multipleOf(0.01),
  rooms: z.number().int().min(0),
  bathrooms: z.number().int().min(0),
  parkingSpaces: z.number().int().min(0),
  totalArea: z.number().min(0).multipleOf(0.01),
  builtArea: z.number().min(0).multipleOf(0.01),
  floorNumber: z.number().int().min(0),
  yearBuilt: z.number().int().min(1950),
  description: z.string().nullable(),
  notes: z.string().nullable(),
  latitude: z.number().min(-90).max(90).nullable(),
  longitude: z.number().min(-180).max(180).nullable(),
  maintenanceFee: z.number().min(0).multipleOf(0.01),
  minimumContractMonths: z.number().int().min(0),
  depositMonths: z.number().int().min(0),
  hasElevator: z.boolean(),
  allowPets: z.boolean(),
  allowKids: z.boolean(),
  status: z.string().max(25),
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
