import { Hono } from 'hono';
import { StatusCodes } from 'http-status-codes';
import { applicationDocuments } from './application-document.js';
import { zValidator } from '#/validator.js';
import { client } from '#/database/client.js';
import { eq, and } from 'drizzle-orm';
import {
  editApplicationDocumentSchema,
  applicationDocumentSchema,
} from './schemas.js';
import { notFoundError } from '#/extensions.js';

const paramSchema = applicationDocumentSchema.pick({
  applicationId: true,
  applicationDocumentId: true,
});

export const editRoute = new Hono().put(
  '/:applicationDocumentId',
  zValidator('param', paramSchema),
  zValidator('json', editApplicationDocumentSchema),
  async c => {
    const { applicationId, applicationDocumentId } = c.req.valid('param');
    const data = c.req.valid('json');

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

    const [item] = await client
      .update(applicationDocuments)
      .set(data)
      .where(
        eq(applicationDocuments.applicationDocumentId, applicationDocumentId)
      )
      .returning();

    return c.json(item, StatusCodes.OK);
  }
);
