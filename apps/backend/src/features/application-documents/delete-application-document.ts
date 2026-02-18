import { Hono } from 'hono';
import { StatusCodes } from 'http-status-codes';
import { applicationDocuments } from './application-document.js';
import { zValidator } from '#/validator.js';
import { client } from '#/database/client.js';
import { eq, and } from 'drizzle-orm';
import { applicationDocumentSchema } from './schemas.js';
import { notFoundError } from '#/extensions.js';

const paramSchema = applicationDocumentSchema.pick({
  applicationId: true,
  applicationDocumentId: true,
});

export const deleteRoute = new Hono().delete(
  '/:applicationDocumentId',
  zValidator('param', paramSchema),
  async c => {
    const { applicationId, applicationDocumentId } = c.req.valid('param');

    const existing = await client
      .select()
      .from(applicationDocuments)
      .where(
        and(
          eq(applicationDocuments.applicationDocumentId, applicationDocumentId),
          eq(applicationDocuments.applicationId, applicationId)
        )
      )
      .limit(1);

    if (existing.length === 0) {
      return notFoundError(
        c,
        `Application document ${applicationDocumentId} not found`
      );
    }

    await client
      .delete(applicationDocuments)
      .where(
        eq(applicationDocuments.applicationDocumentId, applicationDocumentId)
      );

    return c.body(null, StatusCodes.NO_CONTENT);
  }
);
