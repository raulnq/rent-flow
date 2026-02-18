import { paginationSchema } from '#/pagination.js';
import { z } from 'zod';

export const applicationDocumentSchema = z.object({
  applicationDocumentId: z.uuidv7(),
  applicationId: z.uuidv7(),
  fileName: z.string().min(1).max(250),
  contentType: z.string().min(1).max(100),
  filePath: z.string().min(1).max(500),
  documentType: z.string().min(1).max(250),
  notes: z.string().nullable(),
  createdAt: z.date(),
});

export type ApplicationDocument = z.infer<typeof applicationDocumentSchema>;

export const addApplicationDocumentSchema = z.object({
  documentType: z.string().min(1).max(250),
});

export type AddApplicationDocument = z.infer<
  typeof addApplicationDocumentSchema
>;

export const editApplicationDocumentSchema = z.object({
  notes: z.string().nullable(),
});

export type EditApplicationDocument = z.infer<
  typeof editApplicationDocumentSchema
>;

export const listApplicationDocumentsSchema = paginationSchema;

export type ListApplicationDocuments = z.infer<
  typeof listApplicationDocumentsSchema
>;

export const downloadUrlSchema = z.object({
  url: z.string().url(),
  expiresIn: z.number(),
});

export type DownloadUrl = z.infer<typeof downloadUrlSchema>;
