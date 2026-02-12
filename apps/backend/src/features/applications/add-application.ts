import { Hono } from 'hono';
import { v7 } from 'uuid';
import { StatusCodes } from 'http-status-codes';
import { applications } from './application.js';
import { zValidator } from '#/validator.js';
import { client } from '#/database/client.js';
import { addApplicationSchema } from './schemas.js';

export const addRoute = new Hono().post(
  '/',
  zValidator('json', addApplicationSchema),
  async c => {
    const data = c.req.valid('json');
    const [item] = await client
      .insert(applications)
      .values({
        ...data,
        applicationId: v7(),
        status: 'New',
      })
      .returning();
    return c.json(item, StatusCodes.CREATED);
  }
);
