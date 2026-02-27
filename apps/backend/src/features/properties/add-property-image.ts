import { Hono } from 'hono';
import { v7 } from 'uuid';
import { z } from 'zod';
import { StatusCodes } from 'http-status-codes';
import { propertyImages } from './property-image.js';
import { zValidator } from '#/validator.js';
import { client } from '#/database/client.js';
import { propertyImageSchema } from './schemas.js';
import { properties } from './property.js';
import { eq } from 'drizzle-orm';
import { notFoundError } from '#/extensions.js';
import { uploadImage } from './s3-images-client.js';

const paramSchema = propertyImageSchema.pick({ propertyId: true });

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/avif',
];

const formSchema = z.object({
  file: z
    .instanceof(File)
    .refine(file => file.size <= MAX_FILE_SIZE, {
      message: `File size must not exceed ${MAX_FILE_SIZE / (1024 * 1024)}MB`,
    })
    .refine(file => ALLOWED_MIME_TYPES.includes(file.type), {
      message: 'File type must be an image (jpeg, png, gif, webp, avif)',
    })
    .refine(file => file.name.length <= 250, {
      message: 'File name must not exceed 250 characters',
    }),
});

export const addPropertyImageRoute = new Hono().post(
  '/:propertyId/images',
  zValidator('param', paramSchema),
  zValidator('form', formSchema),
  async c => {
    const { propertyId } = c.req.valid('param');
    const { file } = c.req.valid('form');

    const [property] = await client
      .select()
      .from(properties)
      .where(eq(properties.propertyId, propertyId))
      .limit(1);

    if (!property) {
      return notFoundError(c, `Property ${propertyId} not found`);
    }

    const imagePath = await uploadImage(file, propertyId);

    const [item] = await client
      .insert(propertyImages)
      .values({
        propertyImageId: v7(),
        propertyId,
        imageName: file.name,
        contentType: file.type,
        imagePath,
      })
      .returning();

    return c.json(item, StatusCodes.CREATED);
  }
);
