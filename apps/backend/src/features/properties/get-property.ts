import { Hono } from 'hono';
import { StatusCodes } from 'http-status-codes';
import { properties } from './property.js';
import { clients } from '#/features/clients/client.js';
import { zValidator } from '#/validator.js';
import { client } from '#/database/client.js';
import { eq } from 'drizzle-orm';
import { propertySchema } from './schemas.js';
import { notFoundError } from '#/extensions.js';

const schema = propertySchema.pick({ propertyId: true });

export const getRoute = new Hono().get(
  '/:propertyId',
  zValidator('param', schema),
  async c => {
    const { propertyId } = c.req.valid('param');
    const [result] = await client
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
      .where(eq(properties.propertyId, propertyId))
      .limit(1);
    if (!result) {
      return notFoundError(c, `Property ${propertyId} not found`);
    }
    return c.json(result, StatusCodes.OK);
  }
);
