import { Hono } from 'hono';
import { StatusCodes } from 'http-status-codes';
import { applicationDocuments } from './application-document.js';
import { createPage } from '#/pagination.js';
import { zValidator } from '#/validator.js';
import { client } from '#/database/client.js';
import { count, eq } from 'drizzle-orm';
import {
  listApplicationDocumentsSchema,
  applicationDocumentSchema,
} from './schemas.js';
import { applications } from '#/features/applications/application.js';
import { notFoundError } from '#/extensions.js';

const paramSchema = applicationDocumentSchema.pick({ applicationId: true });

export const listRoute = new Hono().get(
  '/',
  zValidator('param', paramSchema),
  zValidator('query', listApplicationDocumentsSchema),
  async c => {
    const { applicationId } = c.req.valid('param');
    const { pageNumber, pageSize } = c.req.valid('query');

    // Verify application exists
    const [application] = await client
      .select()
      .from(applications)
      .where(eq(applications.applicationId, applicationId))
      .limit(1);

    if (!application) {
      return notFoundError(c, `Application ${applicationId} not found`);
    }

    const offset = (pageNumber - 1) * pageSize;

    const [{ totalCount }] = await client
      .select({ totalCount: count() })
      .from(applicationDocuments)
      .where(eq(applicationDocuments.applicationId, applicationId));

    const items = await client
      .select()
      .from(applicationDocuments)
      .where(eq(applicationDocuments.applicationId, applicationId))
      .limit(pageSize)
      .offset(offset)
      .orderBy(applicationDocuments.createdAt);

    return c.json(
      createPage(items, totalCount, pageNumber, pageSize),
      StatusCodes.OK
    );
  }
);
