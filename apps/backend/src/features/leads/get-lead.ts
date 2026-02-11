import { Hono } from 'hono';
import { StatusCodes } from 'http-status-codes';
import { leads } from './lead.js';
import { zValidator } from '#/validator.js';
import { client } from '#/database/client.js';
import { eq } from 'drizzle-orm';
import { leadSchema } from './schemas.js';
import { notFoundError } from '#/extensions.js';

const schema = leadSchema.pick({ leadId: true });

export const getRoute = new Hono().get(
  '/:leadId',
  zValidator('param', schema),
  async c => {
    const { leadId } = c.req.valid('param');
    const [item] = await client
      .select()
      .from(leads)
      .where(eq(leads.leadId, leadId))
      .limit(1);
    if (!item) {
      return notFoundError(c, `Lead ${leadId} not found`);
    }
    return c.json(item, StatusCodes.OK);
  }
);
