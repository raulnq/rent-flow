import { test, describe } from 'node:test';
import assert from 'node:assert';
import {
  createProperty,
  createPropertyImage,
  addPropertyImage,
  deletePropertyImage,
  listPropertyImages,
  jpegImage,
  pngImage,
} from './property-image-dsl.js';
import { createNotFoundError, createValidationError } from '../../errors.js';

describe('Delete Property Image Endpoint', () => {
  test('should delete an existing property image', async () => {
    const propertyId = await createProperty();
    const image = await addPropertyImage(propertyId, jpegImage());

    await deletePropertyImage(propertyId, image.propertyImageId);

    const remaining = await listPropertyImages(propertyId);
    const found = remaining.find(
      i => i.propertyImageId === image.propertyImageId
    );
    assert.strictEqual(
      found,
      undefined,
      'Expected image to be deleted but it still exists'
    );
  });

  test('should only delete the specified image, not others', async () => {
    const propertyId = await createProperty();
    const image1 = await addPropertyImage(propertyId, jpegImage());
    const image2 = await addPropertyImage(propertyId, pngImage());

    await deletePropertyImage(propertyId, image1.propertyImageId);

    const remaining = await listPropertyImages(propertyId);
    const stillExists = remaining.some(
      i => i.propertyImageId === image2.propertyImageId
    );
    assert.ok(
      stillExists,
      'Expected image2 to still exist after deleting image1'
    );
  });

  test('should return 404 for non-existent image', async () => {
    const propertyId = await createProperty();
    const propertyImageId = '01940b6d-1234-7890-abcd-ef1234567890';

    await deletePropertyImage(
      propertyId,
      propertyImageId,
      createNotFoundError(`Property image ${propertyImageId} not found`)
    );
  });

  test('should return 404 when image belongs to a different property', async () => {
    const propertyId1 = await createProperty();
    const propertyId2 = await createProperty();
    const image = await addPropertyImage(propertyId1, jpegImage());

    await deletePropertyImage(
      propertyId2,
      image.propertyImageId,
      createNotFoundError(`Property image ${image.propertyImageId} not found`)
    );
  });

  describe('Param validation', () => {
    test('should reject invalid UUID as propertyImageId', async () => {
      const propertyId = await createProperty();
      await deletePropertyImage(
        propertyId,
        'not-a-uuid',
        createValidationError([
          {
            path: 'propertyImageId',
            message: 'Invalid UUID',
            code: 'invalid_format',
          },
        ])
      );
    });

    test('should reject invalid UUID as propertyId', async () => {
      const image = await createPropertyImage();
      await deletePropertyImage(
        'not-a-uuid',
        image.propertyImageId,
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
