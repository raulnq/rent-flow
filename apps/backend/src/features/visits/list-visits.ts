import { Hono } from 'hono';
import { StatusCodes } from 'http-status-codes';
import { visits } from './visit.js';
import { createPage } from '#/pagination.js';
import { zValidator } from '#/validator.js';
import { client } from '#/database/client.js';
import { count, eq, desc } from 'drizzle-orm';
import { listVisitsSchema, visitSchema } from './schemas.js';

const paramSchema = visitSchema.pick({ applicationId: true });

export const listRoute = new Hono().get(
  '/',
  zValidator('param', paramSchema),
  zValidator('query', listVisitsSchema),
  async c => {
    const { applicationId } = c.req.valid('param');
    const { pageNumber, pageSize } = c.req.valid('query');
    const offset = (pageNumber - 1) * pageSize;

    const [{ totalCount }] = await client
      .select({ totalCount: count() })
      .from(visits)
      .where(eq(visits.applicationId, applicationId));

    const items = await client
      .select()
      .from(visits)
      .where(eq(visits.applicationId, applicationId))
      .orderBy(desc(visits.createdAt))
      .limit(pageSize)
      .offset(offset);

    return c.json(
      createPage(items, totalCount, pageNumber, pageSize),
      StatusCodes.OK
    );
  }
);
