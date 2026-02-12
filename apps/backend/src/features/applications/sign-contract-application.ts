import { Hono } from 'hono';
import { StatusCodes } from 'http-status-codes';
import { applications } from './application.js';
import { zValidator } from '#/validator.js';
import { client } from '#/database/client.js';
import { eq } from 'drizzle-orm';
import { applicationSchema, signContractApplicationSchema } from './schemas.js';
import { notFoundError, conflictError } from '#/extensions.js';
import { getApplicationWithRelations } from './get-application.js';

const paramSchema = applicationSchema.pick({ applicationId: true });

export const signContractRoute = new Hono().post(
  '/:applicationId/sign-contract',
  zValidator('param', paramSchema),
  zValidator('json', signContractApplicationSchema),
  async c => {
    const { applicationId } = c.req.valid('param');
    const { contractSignedAt } = c.req.valid('json');
    const [existing] = await client
      .select()
      .from(applications)
      .where(eq(applications.applicationId, applicationId))
      .limit(1);

    if (!existing) {
      return notFoundError(c, `Application ${applicationId} not found`);
    }

    if (existing.status !== 'Approved') {
      return conflictError(
        c,
        `Cannot sign contract for application with status "${existing.status}". Application must be in "Approved" status.`
      );
    }

    await client
      .update(applications)
      .set({
        status: 'Contract Signed',
        contractSignedAt,
      })
      .where(eq(applications.applicationId, applicationId));

    const [item] = await getApplicationWithRelations()
      .where(eq(applications.applicationId, applicationId))
      .limit(1);

    return c.json(item, StatusCodes.OK);
  }
);
