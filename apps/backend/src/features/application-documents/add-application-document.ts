import { Hono } from 'hono';
import { v7 } from 'uuid';
import { z } from 'zod';
import { StatusCodes } from 'http-status-codes';
import { applicationDocuments } from './application-document.js';
import { zValidator } from '#/validator.js';
import { client } from '#/database/client.js';
import {
  applicationDocumentSchema,
  addApplicationDocumentSchema,
} from './schemas.js';
import { applications } from '#/features/applications/application.js';
import { eq } from 'drizzle-orm';
import { notFoundError } from '#/extensions.js';
import { uploadFile } from './s3-client.js';

const paramSchema = applicationDocumentSchema.pick({ applicationId: true });

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

const formSchema = addApplicationDocumentSchema.extend({
  file: z
    .instanceof(File)
    .refine(file => file.size <= MAX_FILE_SIZE, {
      message: `File size must not exceed ${MAX_FILE_SIZE / (1024 * 1024)}MB`,
    })
    .refine(file => ALLOWED_MIME_TYPES.includes(file.type), {
      message: 'File type must be an image, PDF, or Word document',
    }),
});

export const addRoute = new Hono().post(
  '/',
  zValidator('param', paramSchema),
  zValidator('form', formSchema),
  async c => {
    const { applicationId } = c.req.valid('param');
    const { file, documentType } = c.req.valid('form');

    // Verify application exists
    const [application] = await client
      .select()
      .from(applications)
      .where(eq(applications.applicationId, applicationId))
      .limit(1);

    if (!application) {
      return notFoundError(c, `Application ${applicationId} not found`);
    }

    // Upload file and get path
    const filePath = await uploadFile(file, applicationId);

    // Insert document record
    const [item] = await client
      .insert(applicationDocuments)
      .values({
        applicationDocumentId: v7(),
        applicationId,
        fileName: file.name,
        contentType: file.type,
        filePath,
        documentType,
        notes: null,
      })
      .returning();

    return c.json(item, StatusCodes.CREATED);
  }
);
