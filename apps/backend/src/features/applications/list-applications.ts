import { Hono } from 'hono';
import { StatusCodes } from 'http-status-codes';
import { applications } from './application.js';
import { createPage } from '#/pagination.js';
import { zValidator } from '#/validator.js';
import { client } from '#/database/client.js';
import { count, and, eq, gte, desc } from 'drizzle-orm';
import type { SQL } from 'drizzle-orm';
import { listApplicationsSchema } from './schemas.js';
import { leads } from '#/features/leads/lead.js';
import { properties } from '#/features/properties/property.js';

export const listRoute = new Hono().get(
  '/',
  zValidator('query', listApplicationsSchema),
  async c => {
    const { pageNumber, pageSize, propertyId, leadId, startCreatedAt } =
      c.req.valid('query');
    const filters: SQL[] = [];
    const offset = (pageNumber - 1) * pageSize;

    if (propertyId) filters.push(eq(applications.propertyId, propertyId));
    if (leadId) filters.push(eq(applications.leadId, leadId));
    if (startCreatedAt)
      filters.push(gte(applications.createdAt, new Date(startCreatedAt)));

    const [{ totalCount }] = await client
      .select({ totalCount: count() })
      .from(applications)
      .where(and(...filters));

    const items = await client
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
      .leftJoin(properties, eq(applications.propertyId, properties.propertyId))
      .where(and(...filters))
      .orderBy(desc(applications.createdAt))
      .limit(pageSize)
      .offset(offset);

    return c.json(
      createPage(items, totalCount, pageNumber, pageSize),
      StatusCodes.OK
    );
  }
);
