import { Hono } from 'hono';
import { v7 } from 'uuid';
import { StatusCodes } from 'http-status-codes';
import { properties } from './property.js';
import { zValidator } from '#/validator.js';
import { client } from '#/database/client.js';
import { eq } from 'drizzle-orm';
import { clients } from '#/features/clients/client.js';
import { addPropertySchema } from './schemas.js';
import { notFoundError } from '#/extensions.js';

export const addRoute = new Hono().post(
  '/',
  zValidator('json', addPropertySchema),
  async c => {
    const data = c.req.valid('json');
    const [owner] = await client
      .select({ clientId: clients.clientId })
      .from(clients)
      .where(eq(clients.clientId, data.clientId))
      .limit(1);
    if (!owner) {
      return notFoundError(c, `Client ${data.clientId} not found`);
    }
    const [item] = await client
      .insert(properties)
      .values({
        ...data,
        propertyId: v7(),
      })
      .returning();
    return c.json(item, StatusCodes.CREATED);
  }
);
