import { Hono } from 'hono';
import { v7 } from 'uuid';
import { StatusCodes } from 'http-status-codes';
import { clients } from './client.js';
import { zValidator } from '#/validator.js';
import { client } from '#/database/client.js';
import { eq } from 'drizzle-orm';
import { addClientSchema } from './schemas.js';
import { conflictError } from '#/extensions.js';

export const addRoute = new Hono().post(
  '/',
  zValidator('json', addClientSchema),
  async c => {
    const data = c.req.valid('json');
    const [duplicate] = await client
      .select({ clientId: clients.clientId })
      .from(clients)
      .where(eq(clients.dni, data.dni))
      .limit(1);
    if (duplicate) {
      return conflictError(c, `A client with DNI ${data.dni} already exists`);
    }
    const [item] = await client
      .insert(clients)
      .values({ ...data, clientId: v7() })
      .returning();
    return c.json(item, StatusCodes.CREATED);
  }
);
