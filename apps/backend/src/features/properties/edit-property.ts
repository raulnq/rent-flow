import { Hono } from 'hono';
import { StatusCodes } from 'http-status-codes';
import { properties } from './property.js';
import { zValidator } from '#/validator.js';
import { client } from '#/database/client.js';
import { eq } from 'drizzle-orm';
import { editPropertySchema, propertySchema } from './schemas.js';
import { clients } from '#/features/clients/client.js';
import { notFoundError } from '#/extensions.js';

const paramSchema = propertySchema.pick({ propertyId: true });

export const editRoute = new Hono().put(
  '/:propertyId',
  zValidator('param', paramSchema),
  zValidator('json', editPropertySchema),
  async c => {
    const { propertyId } = c.req.valid('param');
    const data = c.req.valid('json');
    const existing = await client
      .select()
      .from(properties)
      .where(eq(properties.propertyId, propertyId))
      .limit(1);
    if (existing.length === 0) {
      return notFoundError(c, `Property ${propertyId} not found`);
    }
    const [owner] = await client
      .select({ clientId: clients.clientId })
      .from(clients)
      .where(eq(clients.clientId, data.clientId))
      .limit(1);
    if (!owner) {
      return notFoundError(c, `Client ${data.clientId} not found`);
    }
    const [item] = await client
      .update(properties)
      .set({
        ...data,
      })
      .where(eq(properties.propertyId, propertyId))
      .returning();
    return c.json(item, StatusCodes.OK);
  }
);
