import { test, describe } from 'node:test';
import {
  addApplication,
  assertApplication,
  newApplication,
  createLead,
  createProperty,
} from './application-dsl.js';
import { createValidationError, validationError } from '../../errors.js';

describe('Add Application Endpoint', () => {
  test('should create a new application with valid data', async () => {
    const leadId = await createLead();
    const propertyId = await createProperty();
    const input = newApplication({ leadId, propertyId });
    const item = await addApplication(input);

    assertApplication(item)
      .hasLeadId(leadId)
      .hasPropertyId(propertyId)
      .hasStatus('New')
      .hasNotes(null);
  });

  test('should auto-set status to New on creation', async () => {
    const leadId = await createLead();
    const propertyId = await createProperty();
    const input = newApplication({ leadId, propertyId });
    const item = await addApplication(input);

    assertApplication(item).hasStatus('New');
  });

  describe('Property validations', () => {
    test('should reject missing leadId', async () => {
      const propertyId = await createProperty();
      await addApplication(
        newApplication({ leadId: undefined, propertyId }),
        createValidationError([validationError.requiredString('leadId')])
      );
    });

    test('should reject missing propertyId', async () => {
      const leadId = await createLead();
      await addApplication(
        newApplication({ propertyId: undefined, leadId }),
        createValidationError([validationError.requiredString('propertyId')])
      );
    });

    test('should reject invalid leadId UUID format', async () => {
      const propertyId = await createProperty();
      await addApplication(
        newApplication({ leadId: 'invalid-uuid', propertyId }),
        createValidationError([validationError.invalidUuid('leadId')])
      );
    });

    test('should reject invalid propertyId UUID format', async () => {
      const leadId = await createLead();
      await addApplication(
        newApplication({ propertyId: 'invalid-uuid', leadId }),
        createValidationError([validationError.invalidUuid('propertyId')])
      );
    });
  });
});
