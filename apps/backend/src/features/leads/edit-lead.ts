import { Hono } from 'hono';
import { StatusCodes } from 'http-status-codes';
import { leads } from './lead.js';
import { zValidator } from '#/validator.js';
import { client } from '#/database/client.js';
import { eq, and, ne } from 'drizzle-orm';
import { editLeadSchema, leadSchema } from './schemas.js';
import { notFoundError, conflictError } from '#/extensions.js';

const paramSchema = leadSchema.pick({ leadId: true });

export const editRoute = new Hono().put(
  '/:leadId',
  zValidator('param', paramSchema),
  zValidator('json', editLeadSchema),
  async c => {
    const { leadId } = c.req.valid('param');
    const data = c.req.valid('json');
    const existing = await client
      .select()
      .from(leads)
      .where(eq(leads.leadId, leadId))
      .limit(1);
    if (existing.length === 0) {
      return notFoundError(c, `Lead ${leadId} not found`);
    }
    const [duplicate] = await client
      .select({ leadId: leads.leadId })
      .from(leads)
      .where(and(eq(leads.dni, data.dni), ne(leads.leadId, leadId)))
      .limit(1);
    if (duplicate) {
      return conflictError(c, `A lead with DNI ${data.dni} already exists`);
    }
    const [item] = await client
      .update(leads)
      .set(data)
      .where(eq(leads.leadId, leadId))
      .returning();
    return c.json(item, StatusCodes.OK);
  }
);
