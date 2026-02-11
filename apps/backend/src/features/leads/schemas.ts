import { paginationSchema } from '#/pagination.js';
import { z } from 'zod';

export const leadSchema = z.object({
  leadId: z.uuidv7(),
  name: z.string().min(1).max(200),
  dni: z.string().min(1).max(20),
  phone: z.string().min(1).max(20),
  email: z.string().email().max(100).nullable(),
  address: z.string().max(1000).nullable(),
  birthDate: z.string().nullable(),
  occupation: z.string().max(100).nullable(),
  notes: z.string().nullable(),
  nationality: z.string().max(50).nullable(),
});

export type Lead = z.infer<typeof leadSchema>;

export const addLeadSchema = leadSchema.omit({ leadId: true });

export type AddLead = z.infer<typeof addLeadSchema>;

export const editLeadSchema = leadSchema;

export type EditLead = z.infer<typeof editLeadSchema>;

export const listLeadsSchema = paginationSchema.extend({
  name: z.string().optional(),
});

export type ListLeads = z.infer<typeof listLeadsSchema>;
