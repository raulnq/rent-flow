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
        rooms: properties.rooms,
        bathrooms: properties.bathrooms,
        parkingSpaces: properties.parkingSpaces,
        totalArea: properties.totalArea,
        builtArea: properties.builtArea,
        floorNumber: properties.floorNumber,
        yearBuilt: properties.yearBuilt,
        description: properties.description,
        notes: properties.notes,
        latitude: properties.latitude,
        longitude: properties.longitude,
        maintenanceFee: properties.maintenanceFee,
        minimumContractMonths: properties.minimumContractMonths,
        depositMonths: properties.depositMonths,
        hasElevator: properties.hasElevator,
        allowPets: properties.allowPets,
        allowKids: properties.allowKids,
        status: properties.status,
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
