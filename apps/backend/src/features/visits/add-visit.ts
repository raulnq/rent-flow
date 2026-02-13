import { Hono } from 'hono';
import { v7 } from 'uuid';
import { StatusCodes } from 'http-status-codes';
import { visits } from './visit.js';
import { zValidator } from '#/validator.js';
import { client } from '#/database/client.js';
import { addVisitSchema, visitSchema } from './schemas.js';
import { applications } from '#/features/applications/application.js';
import { eq } from 'drizzle-orm';
import { notFoundError } from '#/extensions.js';

const paramSchema = visitSchema.pick({ applicationId: true });

export const addRoute = new Hono().post(
  '/',
  zValidator('param', paramSchema),
  zValidator('json', addVisitSchema),
  async c => {
    const { applicationId } = c.req.valid('param');
    const data = c.req.valid('json');

    const [application] = await client
      .select()
      .from(applications)
      .where(eq(applications.applicationId, applicationId))
      .limit(1);

    if (!application) {
      return notFoundError(c, `Application ${applicationId} not found`);
    }

    const [item] = await client
      .insert(visits)
      .values({
        ...data,
        visitId: v7(),
        applicationId,
        status: 'Scheduled',
        scheduledAt: new Date(data.scheduledAt),
      })
      .returning();

    return c.json(item, StatusCodes.CREATED);
  }
);
