import { Hono } from 'hono';
import { StatusCodes } from 'http-status-codes';
import { propertyImages } from './property-image.js';
import { zValidator } from '#/validator.js';
import { client } from '#/database/client.js';
import { eq, and } from 'drizzle-orm';
import { propertyImageSchema } from './schemas.js';
import { notFoundError } from '#/extensions.js';
import { deleteImage } from './s3-images-client.js';

const paramSchema = propertyImageSchema.pick({
  propertyId: true,
  propertyImageId: true,
});

export const deletePropertyImageRoute = new Hono().delete(
  '/:propertyId/images/:propertyImageId',
  zValidator('param', paramSchema),
  async c => {
    const { propertyId, propertyImageId } = c.req.valid('param');

    const [existing] = await client
      .select()
      .from(propertyImages)
      .where(
        and(
          eq(propertyImages.propertyImageId, propertyImageId),
          eq(propertyImages.propertyId, propertyId)
        )
      )
      .limit(1);

    if (!existing) {
      return notFoundError(c, `Property image ${propertyImageId} not found`);
    }

    await deleteImage(existing.imagePath);

    await client
      .delete(propertyImages)
      .where(eq(propertyImages.propertyImageId, propertyImageId));

    return c.body(null, StatusCodes.NO_CONTENT);
  }
);
