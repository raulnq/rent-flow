import { Hono } from 'hono';
import { StatusCodes } from 'http-status-codes';
import { applications } from './application.js';
import { zValidator } from '#/validator.js';
import { client } from '#/database/client.js';
import { eq } from 'drizzle-orm';
import { applicationSchema } from './schemas.js';
import { notFoundError } from '#/extensions.js';
import { leads } from '#/features/leads/lead.js';
import { properties } from '#/features/properties/property.js';

const schema = applicationSchema.pick({ applicationId: true });

export const getRoute = new Hono().get(
  '/:applicationId',
  zValidator('param', schema),
  async c => {
    const { applicationId } = c.req.valid('param');
    const [item] = await getApplicationWithRelations()
      .where(eq(applications.applicationId, applicationId))
      .limit(1);
    if (!item) {
      return notFoundError(c, `Application ${applicationId} not found`);
    }
    return c.json(item, StatusCodes.OK);
  }
);

export function getApplicationWithRelations() {
  return client
    .select({
      applicationId: applications.applicationId,
      leadId: applications.leadId,
      propertyId: applications.propertyId,
      status: applications.status,
      notes: applications.notes,
      createdAt: applications.createdAt,
      reviewStartedAt: applications.reviewStartedAt,
      approvedAt: applications.approvedAt,
      rejectedAt: applications.rejectedAt,
      rejectedReason: applications.rejectedReason,
      withdrawnAt: applications.withdrawnAt,
      withdrawnReason: applications.withdrawnReason,
      contractSignedAt: applications.contractSignedAt,
      leadName: leads.name,
      propertyAddress: properties.address,
    })
    .from(applications)
    .leftJoin(leads, eq(applications.leadId, leads.leadId))
    .leftJoin(properties, eq(applications.propertyId, properties.propertyId));
}
