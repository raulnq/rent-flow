import { Hono } from 'hono';
import { StatusCodes } from 'http-status-codes';
import { leads } from './lead.js';
import { createPage } from '#/pagination.js';
import { zValidator } from '#/validator.js';
import { client } from '#/database/client.js';
import { like, count, and } from 'drizzle-orm';
import type { SQL } from 'drizzle-orm';
import { listLeadsSchema } from './schemas.js';

export const listRoute = new Hono().get(
  '/',
  zValidator('query', listLeadsSchema),
  async c => {
    const { pageNumber, pageSize, name } = c.req.valid('query');
    const filters: SQL[] = [];
    const offset = (pageNumber - 1) * pageSize;
    if (name) filters.push(like(leads.name, `%${name}%`));

    const [{ totalCount }] = await client
      .select({ totalCount: count() })
      .from(leads)
      .where(and(...filters));

    const items = await client
      .select()
      .from(leads)
      .where(and(...filters))
      .limit(pageSize)
      .offset(offset);

    return c.json(
      createPage(items, totalCount, pageNumber, pageSize),
      StatusCodes.OK
    );
  }
);
