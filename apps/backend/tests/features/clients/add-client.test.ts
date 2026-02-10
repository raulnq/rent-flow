import { test, describe } from 'node:test';
import { addClient, assertClient, alice, bob } from './client-dsl.js';
import {
  emptyText,
  bigText,
  createValidationError,
  createConflictError,
  validationError,
} from '../../errors.js';

describe('Add Client Endpoint', () => {
  test('should create a new client with all fields', async () => {
    const input = alice();
    const item = await addClient(input);
    assertClient(item)
      .hasName(input.name)
      .hasDni(input.dni)
      .hasPhone(input.phone)
      .hasEmail(input.email)
      .hasAddress(input.address);
  });

  test('should create a new client with only required fields', async () => {
    const input = bob();
    const item = await addClient(input);
    assertClient(item)
      .hasName(input.name)
      .hasDni(input.dni)
      .hasPhone(input.phone)
      .hasEmail(null)
      .hasAddress(null);
  });

  test('should reject duplicate dni', async () => {
    const existing = await addClient(alice());
    await addClient(
      alice({ dni: existing.dni }),
      createConflictError(`A client with DNI ${existing.dni} already exists`)
    );
  });

  describe('Property validations', () => {
    const testCases = [
      {
        name: 'should reject empty name',
        input: alice({ name: emptyText }),
        expectedError: createValidationError([
          validationError.tooSmall('name', 1),
        ]),
      },
      {
        name: 'should reject name longer than 200 characters',
        input: alice({ name: bigText(201) }),
        expectedError: createValidationError([
          validationError.tooBig('name', 200),
        ]),
      },
      {
        name: 'should reject missing name',
        input: alice({ name: undefined }),
        expectedError: createValidationError([
          validationError.requiredString('name'),
        ]),
      },
      {
        name: 'should reject empty dni',
        input: alice({ dni: emptyText }),
        expectedError: createValidationError([
          validationError.tooSmall('dni', 1),
        ]),
      },
      {
        name: 'should reject missing dni',
        input: alice({ dni: undefined }),
        expectedError: createValidationError([
          validationError.requiredString('dni'),
        ]),
      },
      {
        name: 'should reject empty phone',
        input: alice({ phone: emptyText }),
        expectedError: createValidationError([
          validationError.tooSmall('phone', 1),
        ]),
      },
      {
        name: 'should reject missing phone',
        input: alice({ phone: undefined }),
        expectedError: createValidationError([
          validationError.requiredString('phone'),
        ]),
      },
      {
        name: 'should reject invalid email format',
        input: alice({ email: 'not-an-email' }),
        expectedError: createValidationError([
          validationError.invalidEmail('email'),
        ]),
      },
    ];

    for (const { name, input, expectedError } of testCases) {
      test(name, async () => {
        await addClient(input, expectedError);
      });
    }
  });
});
