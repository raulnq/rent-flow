import { testClient } from 'hono/testing';
import { app } from '#/app.js';
import type { ProblemDocument } from 'http-problem-details';
import { StatusCodes } from 'http-status-codes';
import assert from 'node:assert';
import { assertStrictEqualProblemDocument } from '../../assertions.js';
import type { PropertyImage } from '#/features/properties/schemas.js';
import { createOwner, apartment, addProperty } from './property-dsl.js';

// --- Helper: create a property ready to attach images to ---

export const createProperty = async (): Promise<string> => {
  const clientId = await createOwner();
  const prop = await addProperty(apartment({ clientId }));
  return prop.propertyId;
};

// --- Mock file helpers ---

export const createMockImageFile = (overrides?: {
  name?: string;
  type?: string;
  size?: number;
}): File => {
  const name = overrides?.name ?? 'photo.jpg';
  const type = overrides?.type ?? 'image/jpeg';
  const size = overrides?.size ?? 1024;
  const content = 'x'.repeat(size);
  const blob = new Blob([content], { type });
  return new File([blob], name, { type });
};

export const jpegImage = (): File =>
  createMockImageFile({ name: 'photo.jpg', type: 'image/jpeg' });

export const pngImage = (): File =>
  createMockImageFile({ name: 'photo.png', type: 'image/png' });

export const oversizedImage = (): File =>
  createMockImageFile({
    name: 'huge.jpg',
    type: 'image/jpeg',
    size: 51 * 1024 * 1024,
  });

export const invalidFileType = (): File =>
  createMockImageFile({ name: 'script.exe', type: 'application/x-msdownload' });

// --- Action functions ---

export async function addPropertyImage(
  propertyId: string,
  file: File
): Promise<PropertyImage>;
export async function addPropertyImage(
  propertyId: string,
  file: File,
  expectedProblemDocument: ProblemDocument
): Promise<ProblemDocument>;

export async function addPropertyImage(
  propertyId: string,
  file: File,
  expectedProblemDocument?: ProblemDocument
): Promise<PropertyImage | ProblemDocument> {
  const api = testClient(app);
  const response = await api.api.properties[':propertyId'].images.$post({
    param: { propertyId },
    form: { file },
  });

  if (response.status === StatusCodes.CREATED) {
    assert.ok(
      !expectedProblemDocument,
      'Expected a problem document but received CREATED status'
    );
    const item = await response.json();
    assert.ok(item);
    return {
      ...item,
      createdAt: new Date(item.createdAt),
    };
  } else {
    const problemDocument = await response.json();
    assert.ok(problemDocument);
    assert.ok(
      expectedProblemDocument,
      `Expected CREATED status but received ${response.status}. Error: ${JSON.stringify(problemDocument)}`
    );
    assertStrictEqualProblemDocument(problemDocument, expectedProblemDocument);
    return problemDocument;
  }
}

export async function deletePropertyImage(
  propertyId: string,
  propertyImageId: string
): Promise<void>;
export async function deletePropertyImage(
  propertyId: string,
  propertyImageId: string,
  expectedProblemDocument: ProblemDocument
): Promise<ProblemDocument>;

export async function deletePropertyImage(
  propertyId: string,
  propertyImageId: string,
  expectedProblemDocument?: ProblemDocument
): Promise<void | ProblemDocument> {
  const api = testClient(app);
  const response = await api.api.properties[':propertyId'].images[
    ':propertyImageId'
  ].$delete({
    param: { propertyId, propertyImageId },
  });

  if (response.status === StatusCodes.NO_CONTENT) {
    assert.ok(
      !expectedProblemDocument,
      'Expected a problem document but received NO_CONTENT status'
    );
    return;
  } else {
    const problemDocument = await response.json();
    assert.ok(problemDocument);
    assert.ok(
      expectedProblemDocument,
      `Expected NO_CONTENT status but received ${response.status}`
    );
    assertStrictEqualProblemDocument(problemDocument, expectedProblemDocument);
    return problemDocument;
  }
}

export async function listPropertyImages(
  propertyId: string
): Promise<PropertyImage[]>;
export async function listPropertyImages(
  propertyId: string,
  expectedProblemDocument: ProblemDocument
): Promise<ProblemDocument>;

export async function listPropertyImages(
  propertyId: string,
  expectedProblemDocument?: ProblemDocument
): Promise<PropertyImage[] | ProblemDocument> {
  const api = testClient(app);
  const response = await api.api.properties[':propertyId'].images.$get({
    param: { propertyId },
  });

  if (response.status === StatusCodes.OK) {
    assert.ok(
      !expectedProblemDocument,
      'Expected a problem document but received OK status'
    );
    const items = await response.json();
    assert.ok(Array.isArray(items));
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return items.map((item: any) => ({
      ...item,
      createdAt: new Date(item.createdAt),
    }));
  } else {
    const problemDocument = await response.json();
    assert.ok(problemDocument);
    assert.ok(
      expectedProblemDocument,
      `Expected OK status but received ${response.status}`
    );
    assertStrictEqualProblemDocument(problemDocument, expectedProblemDocument);
    return problemDocument;
  }
}

export const createPropertyImage = async (
  propertyId?: string
): Promise<PropertyImage> => {
  const pid = propertyId ?? (await createProperty());
  return await addPropertyImage(pid, jpegImage());
};

// --- Fluent assertion builder ---

export const assertPropertyImage = (item: PropertyImage) => {
  return {
    hasPropertyId(expected: string) {
      assert.strictEqual(
        item.propertyId,
        expected,
        `Expected propertyId to be ${expected}, got ${item.propertyId}`
      );
      return this;
    },
    hasImageName(expected: string) {
      assert.strictEqual(
        item.imageName,
        expected,
        `Expected imageName to be ${expected}, got ${item.imageName}`
      );
      return this;
    },
    hasContentType(expected: string) {
      assert.strictEqual(
        item.contentType,
        expected,
        `Expected contentType to be ${expected}, got ${item.contentType}`
      );
      return this;
    },
    hasImagePath() {
      assert.ok(item.imagePath, `Expected imagePath to be set`);
      assert.ok(
        item.imagePath.length > 0,
        `Expected imagePath to be non-empty`
      );
      return this;
    },
    hasCreatedAt() {
      assert.ok(
        item.createdAt instanceof Date,
        `Expected createdAt to be a Date`
      );
      return this;
    },
  };
};
