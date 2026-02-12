import { Hono } from 'hono';
import { StatusCodes } from 'http-status-codes';
import { applications } from './application.js';
import { zValidator } from '#/validator.js';
import { client } from '#/database/client.js';
import { eq } from 'drizzle-orm';
import { applicationSchema, rejectApplicationSchema } from './schemas.js';
import { notFoundError, conflictError } from '#/extensions.js';
import { getApplicationWithRelations } from './get-application.js';

const paramSchema = applicationSchema.pick({ applicationId: true });

export const rejectRoute = new Hono().post(
  '/:applicationId/reject',
  zValidator('param', paramSchema),
  zValidator('json', rejectApplicationSchema),
  async c => {
    const { applicationId } = c.req.valid('param');
    const { rejectedReason, rejectedAt } = c.req.valid('json');
    const [existing] = await client
      .select()
      .from(applications)
      .where(eq(applications.applicationId, applicationId))
      .limit(1);

    if (!existing) {
      return notFoundError(c, `Application ${applicationId} not found`);
    }

    if (existing.status !== 'New' && existing.status !== 'Under Review') {
      return conflictError(
        c,
        `Cannot reject application with status "${existing.status}". Application must be in "New" or "Under Review" status.`
      );
    }

    await client
      .update(applications)
      .set({
        status: 'Rejected',
        rejectedAt,
        rejectedReason,
      })
      .where(eq(applications.applicationId, applicationId));

    const [item] = await getApplicationWithRelations()
      .where(eq(applications.applicationId, applicationId))
      .limit(1);

    return c.json(item, StatusCodes.OK);
  }
);
