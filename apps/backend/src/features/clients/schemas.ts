import { paginationSchema } from '#/pagination.js';
import { z } from 'zod';

export const clientSchema = z.object({
  clientId: z.uuidv7(),
  name: z.string().min(1).max(200),
  dni: z.string().min(1).max(20),
  phone: z.string().min(1).max(20),
  email: z.string().email().max(100).nullable(),
  address: z.string().max(1000).nullable(),
});

export type Client = z.infer<typeof clientSchema>;

export const addClientSchema = clientSchema.omit({ clientId: true });

export type AddClient = z.infer<typeof addClientSchema>;

export const editClientSchema = clientSchema;

export type EditClient = z.infer<typeof editClientSchema>;

export const listClientsSchema = paginationSchema.extend({
  name: z.string().optional(),
});

export type ListClients = z.infer<typeof listClientsSchema>;
