import { test, describe } from 'node:test';
import { addLead, assertLead, getLead, john } from './lead-dsl.js';
import {
  createNotFoundError,
  createValidationError,
  validationError,
} from '../../errors.js';

describe('Get Lead Endpoint', () => {
  test('should get an existing lead by ID', async () => {
    const created = await addLead(john());
    const retrieved = await getLead(created.leadId);
    assertLead(retrieved).isTheSameOf(created);
  });

  test('should return 404 for non-existent lead', async () => {
    const id = '01940b6d-1234-7890-abcd-ef1234567890';
    await getLead(id, createNotFoundError(`Lead ${id} not found`));
  });

  test('should reject invalid UUID format', async () => {
    await getLead(
      'invalid-uuid',
      createValidationError([validationError.invalidUuid('leadId')])
    );
  });
});
