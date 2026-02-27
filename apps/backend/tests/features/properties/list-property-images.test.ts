import { test, describe } from 'node:test';
import assert from 'node:assert';
import {
  createProperty,
  addPropertyImage,
  listPropertyImages,
  jpegImage,
  pngImage,
  assertPropertyImage,
} from './property-image-dsl.js';
import { createNotFoundError, createValidationError } from '../../errors.js';

describe('List Property Images Endpoint', () => {
  test('should return empty array for property with no images', async () => {
    const propertyId = await createProperty();
    const images = await listPropertyImages(propertyId);

    assert.strictEqual(images.length, 0);
  });

  test('should return all images for a property', async () => {
    const propertyId = await createProperty();
    await addPropertyImage(propertyId, jpegImage());
    await addPropertyImage(propertyId, pngImage());

    const images = await listPropertyImages(propertyId);

    assert.strictEqual(images.length, 2);
    for (const image of images) {
      assertPropertyImage(image).hasPropertyId(propertyId).hasImagePath();
    }
  });

  test('should not return images from other properties', async () => {
    const propertyId1 = await createProperty();
    const propertyId2 = await createProperty();
    await addPropertyImage(propertyId1, jpegImage());

    const images = await listPropertyImages(propertyId2);

    assert.strictEqual(images.length, 0);
  });

  test('should return 404 for non-existent property', async () => {
    const propertyId = '01940b6d-1234-7890-abcd-ef1234567890';
    await listPropertyImages(
      propertyId,
      createNotFoundError(`Property ${propertyId} not found`)
    );
  });

  describe('Param validation', () => {
    test('should reject invalid UUID as propertyId', async () => {
      await listPropertyImages(
        'not-a-uuid',
        createValidationError([
          {
            path: 'propertyId',
            message: 'Invalid UUID',
            code: 'invalid_format',
          },
        ])
      );
    });
  });
});
