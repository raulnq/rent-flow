import { Hono } from 'hono';
import { StatusCodes } from 'http-status-codes';
import { applications } from './application.js';
import { zValidator } from '#/validator.js';
import { client } from '#/database/client.js';
import { eq } from 'drizzle-orm';
import { applicationSchema, startReviewApplicationSchema } from './schemas.js';
import { notFoundError } from '#/extensions.js';
import { getApplicationWithRelations } from './get-application.js';

const paramSchema = applicationSchema.pick({ applicationId: true });

export const startReviewRoute = new Hono().post(
  '/:applicationId/start-review',
  zValidator('param', paramSchema),
  zValidator('json', startReviewApplicationSchema),
  async c => {
    const { applicationId } = c.req.valid('param');
    const { reviewStartedAt } = c.req.valid('json');
    const existing = await client
      .select()
      .from(applications)
      .where(eq(applications.applicationId, applicationId))
      .limit(1);

    if (existing.length === 0) {
      return notFoundError(c, `Application ${applicationId} not found`);
    }

    await client
      .update(applications)
      .set({
        status: 'Under Review',
        reviewStartedAt,
      })
      .where(eq(applications.applicationId, applicationId));

    const [item] = await getApplicationWithRelations()
      .where(eq(applications.applicationId, applicationId))
      .limit(1);

    return c.json(item, StatusCodes.OK);
  }
);
