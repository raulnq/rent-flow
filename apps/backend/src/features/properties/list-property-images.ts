import { Hono } from 'hono';
import { StatusCodes } from 'http-status-codes';
import { propertyImages } from './property-image.js';
import { zValidator } from '#/validator.js';
import { client } from '#/database/client.js';
import { eq } from 'drizzle-orm';
import { propertyImageSchema } from './schemas.js';
import { properties } from './property.js';
import { notFoundError } from '#/extensions.js';

const paramSchema = propertyImageSchema.pick({ propertyId: true });

export const listPropertyImagesRoute = new Hono().get(
  '/:propertyId/images',
  zValidator('param', paramSchema),
  async c => {
    const { propertyId } = c.req.valid('param');

    const [property] = await client
      .select()
      .from(properties)
      .where(eq(properties.propertyId, propertyId))
      .limit(1);

    if (!property) {
      return notFoundError(c, `Property ${propertyId} not found`);
    }

    const items = await client
      .select()
      .from(propertyImages)
      .where(eq(propertyImages.propertyId, propertyId));

    return c.json(items, StatusCodes.OK);
  }
);
