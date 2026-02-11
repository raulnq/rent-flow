import { Hono } from 'hono';
import { v7 } from 'uuid';
import { StatusCodes } from 'http-status-codes';
import { leads } from './lead.js';
import { zValidator } from '#/validator.js';
import { client } from '#/database/client.js';
import { eq } from 'drizzle-orm';
import { addLeadSchema } from './schemas.js';
import { conflictError } from '#/extensions.js';

export const addRoute = new Hono().post(
  '/',
  zValidator('json', addLeadSchema),
  async c => {
    const data = c.req.valid('json');
    const [duplicate] = await client
      .select({ leadId: leads.leadId })
      .from(leads)
      .where(eq(leads.dni, data.dni))
      .limit(1);
    if (duplicate) {
      return conflictError(c, `A lead with DNI ${data.dni} already exists`);
    }
    const [item] = await client
      .insert(leads)
      .values({ ...data, leadId: v7() })
      .returning();
    return c.json(item, StatusCodes.CREATED);
  }
);
