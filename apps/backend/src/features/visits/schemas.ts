import { paginationSchema } from '#/pagination.js';
import { z } from 'zod';

export const visitSchema = z.object({
  visitId: z.uuidv7(),
  applicationId: z.uuidv7(),
  status: z.string().max(25),
  scheduledAt: z.date(),
  notes: z.string().nullable(),
  cancellationReason: z.string().nullable(),
  createdAt: z.date(),
});

export type Visit = z.infer<typeof visitSchema>;

const datetimeString = z
  .string()
  .min(1)
  .refine(val => !isNaN(Date.parse(val)), {
    message: 'Invalid datetime format',
  });

export const addVisitSchema = z.object({
  scheduledAt: datetimeString,
});

export type AddVisit = z.infer<typeof addVisitSchema>;

export const editVisitSchema = z.object({
  scheduledAt: datetimeString,
  notes: z.string().nullable(),
});

export type EditVisit = z.infer<typeof editVisitSchema>;

export const cancelVisitSchema = z.object({
  cancellationReason: z.string().min(1),
});

export type CancelVisit = z.infer<typeof cancelVisitSchema>;

export const listVisitsSchema = paginationSchema;

export type ListVisits = z.infer<typeof listVisitsSchema>;
