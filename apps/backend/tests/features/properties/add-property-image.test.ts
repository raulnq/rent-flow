import { test, describe } from 'node:test';
import {
  addPropertyImage,
  assertPropertyImage,
  createProperty,
  jpegImage,
  pngImage,
  oversizedImage,
  invalidFileType,
  createMockImageFile,
} from './property-image-dsl.js';
import { createValidationError, createNotFoundError } from '../../errors.js';

describe('Add Property Image Endpoint', () => {
  test('should upload a JPEG image with valid data', async () => {
    const propertyId = await createProperty();
    const file = jpegImage();
    const image = await addPropertyImage(propertyId, file);

    assertPropertyImage(image)
      .hasPropertyId(propertyId)
      .hasImageName(file.name)
      .hasContentType(file.type)
      .hasImagePath()
      .hasCreatedAt();
  });

  test('should upload a PNG image', async () => {
    const propertyId = await createProperty();
    const file = pngImage();
    const image = await addPropertyImage(propertyId, file);

    assertPropertyImage(image)
      .hasPropertyId(propertyId)
      .hasImageName(file.name)
      .hasContentType(file.type)
      .hasImagePath();
  });

  test('should return 404 for non-existent property', async () => {
    const propertyId = '01940b6d-1234-7890-abcd-ef1234567890';
    await addPropertyImage(
      propertyId,
      jpegImage(),
      createNotFoundError(`Property ${propertyId} not found`)
    );
  });

  describe('File validation', () => {
    test('should reject file size exceeding 50MB', async () => {
      const propertyId = await createProperty();
      await addPropertyImage(
        propertyId,
        oversizedImage(),
        createValidationError([
          {
            path: 'file',
            message: 'File size must not exceed 50MB',
            code: 'custom',
          },
        ])
      );
    });

    test('should reject invalid file type', async () => {
      const propertyId = await createProperty();
      await addPropertyImage(
        propertyId,
        invalidFileType(),
        createValidationError([
          {
            path: 'file',
            message: 'File type must be an image (jpeg, png, gif, webp, avif)',
            code: 'custom',
          },
        ])
      );
    });

    test('should reject file name exceeding 250 characters', async () => {
      const propertyId = await createProperty();
      const longName = `${'a'.repeat(247)}.jpg`;
      const file = createMockImageFile({ name: longName, type: 'image/jpeg' });
      await addPropertyImage(
        propertyId,
        file,
        createValidationError([
          {
            path: 'file',
            message: 'File name must not exceed 250 characters',
            code: 'custom',
          },
        ])
      );
    });
  });

  describe('Param validation', () => {
    test('should reject invalid UUID as propertyId', async () => {
      await addPropertyImage(
        'not-a-uuid',
        jpegImage(),
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
