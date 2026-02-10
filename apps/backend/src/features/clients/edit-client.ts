import { Hono } from 'hono';
import { StatusCodes } from 'http-status-codes';
import { clients } from './client.js';
import { zValidator } from '#/validator.js';
import { client } from '#/database/client.js';
import { eq, and, ne } from 'drizzle-orm';
import { editClientSchema, clientSchema } from './schemas.js';
import { notFoundError, conflictError } from '#/extensions.js';

const paramSchema = clientSchema.pick({ clientId: true });

export const editRoute = new Hono().put(
  '/:clientId',
  zValidator('param', paramSchema),
  zValidator('json', editClientSchema),
  async c => {
    const { clientId } = c.req.valid('param');
    const data = c.req.valid('json');
    const existing = await client
      .select()
      .from(clients)
      .where(eq(clients.clientId, clientId))
      .limit(1);
    if (existing.length === 0) {
      return notFoundError(c, `Client ${clientId} not found`);
    }
    const [duplicate] = await client
      .select({ clientId: clients.clientId })
      .from(clients)
      .where(and(eq(clients.dni, data.dni), ne(clients.clientId, clientId)))
      .limit(1);
    if (duplicate) {
      return conflictError(c, `A client with DNI ${data.dni} already exists`);
    }
    const [item] = await client
      .update(clients)
      .set(data)
      .where(eq(clients.clientId, clientId))
      .returning();
    return c.json(item, StatusCodes.OK);
  }
);
