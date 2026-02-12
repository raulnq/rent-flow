import { Hono } from 'hono';
import { StatusCodes } from 'http-status-codes';
import { applications } from './application.js';
import { zValidator } from '#/validator.js';
import { client } from '#/database/client.js';
import { eq } from 'drizzle-orm';
import { applicationSchema, withdrawApplicationSchema } from './schemas.js';
import { notFoundError, conflictError } from '#/extensions.js';
import { getApplicationWithRelations } from './get-application.js';

const paramSchema = applicationSchema.pick({ applicationId: true });

export const withdrawRoute = new Hono().post(
  '/:applicationId/withdraw',
  zValidator('param', paramSchema),
  zValidator('json', withdrawApplicationSchema),
  async c => {
    const { applicationId } = c.req.valid('param');
    const { withdrawnReason, withdrawnAt } = c.req.valid('json');
    const [existing] = await client
      .select()
      .from(applications)
      .where(eq(applications.applicationId, applicationId))
      .limit(1);

    if (!existing) {
      return notFoundError(c, `Application ${applicationId} not found`);
    }

    const allowedStatuses = ['New', 'Under Review', 'Approved'];
    if (!allowedStatuses.includes(existing.status)) {
      return conflictError(
        c,
        `Cannot withdraw application with status "${existing.status}". Application must be in "New", "Under Review", or "Approved" status.`
      );
    }

    await client
      .update(applications)
      .set({
        status: 'Withdrawn',
        withdrawnAt,
        withdrawnReason,
      })
      .where(eq(applications.applicationId, applicationId));

    const [item] = await getApplicationWithRelations()
      .where(eq(applications.applicationId, applicationId))
      .limit(1);

    return c.json(item, StatusCodes.OK);
  }
);
