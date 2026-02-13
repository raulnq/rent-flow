import { Hono } from 'hono';
import { StatusCodes } from 'http-status-codes';
import { visits } from './visit.js';
import { zValidator } from '#/validator.js';
import { client } from '#/database/client.js';
import { eq, and } from 'drizzle-orm';
import { cancelVisitSchema, visitSchema } from './schemas.js';
import { notFoundError } from '#/extensions.js';

const paramSchema = visitSchema.pick({ applicationId: true, visitId: true });

export const cancelRoute = new Hono().post(
  '/:visitId/cancel',
  zValidator('param', paramSchema),
  zValidator('json', cancelVisitSchema),
  async c => {
    const { applicationId, visitId } = c.req.valid('param');
    const { cancellationReason } = c.req.valid('json');

    const [existing] = await client
      .select()
      .from(visits)
      .where(
        and(
          eq(visits.visitId, visitId),
          eq(visits.applicationId, applicationId)
        )
      )
      .limit(1);

    if (!existing) {
      return notFoundError(c, `Visit ${visitId} not found`);
    }

    const [item] = await client
      .update(visits)
      .set({
        status: 'Cancelled',
        cancellationReason,
      })
      .where(eq(visits.visitId, visitId))
      .returning();

    return c.json(item, StatusCodes.OK);
  }
);
