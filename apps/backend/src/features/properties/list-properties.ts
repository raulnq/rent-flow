import { Hono } from 'hono';
import { StatusCodes } from 'http-status-codes';
import { properties } from './property.js';
import { createPage } from '#/pagination.js';
import { zValidator } from '#/validator.js';
import { client } from '#/database/client.js';
import { like, count, and, eq } from 'drizzle-orm';
import type { SQL } from 'drizzle-orm';
import { listPropertiesSchema } from './schemas.js';
import { clients } from '#/features/clients/client.js';

export const listRoute = new Hono().get(
  '/',
  zValidator('query', listPropertiesSchema),
  async c => {
    const { pageNumber, pageSize, address } = c.req.valid('query');
    const filters: SQL[] = [];
    const offset = (pageNumber - 1) * pageSize;
    if (address) filters.push(like(properties.address, `%${address}%`));

    const [{ totalCount }] = await client
      .select({ totalCount: count() })
      .from(properties)
      .where(and(...filters));

    const items = await client
      .select({
        propertyId: properties.propertyId,
        address: properties.address,
        propertyType: properties.propertyType,
        clientId: properties.clientId,
        rentalPrice: properties.rentalPrice,
        numberOfRooms: properties.numberOfRooms,
        numberOfBathrooms: properties.numberOfBathrooms,
        numberOfGarages: properties.numberOfGarages,
        totalArea: properties.totalArea,
        description: properties.description,
        constraints: properties.constraints,
        latitude: properties.latitude,
        longitude: properties.longitude,
        clientName: clients.name,
      })
      .from(properties)
      .leftJoin(clients, eq(properties.clientId, clients.clientId))
      .where(and(...filters))
      .limit(pageSize)
      .offset(offset);

    return c.json(
      createPage(items, totalCount, pageNumber, pageSize),
      StatusCodes.OK
    );
  }
);
