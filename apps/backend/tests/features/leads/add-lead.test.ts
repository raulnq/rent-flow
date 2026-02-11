import { test, describe } from 'node:test';
import { addLead, assertLead, john, jane } from './lead-dsl.js';
import {
  emptyText,
  bigText,
  createValidationError,
  createConflictError,
  validationError,
} from '../../errors.js';

describe('Add Lead Endpoint', () => {
  test('should create a new lead with all fields', async () => {
    const input = john();
    const item = await addLead(input);
    assertLead(item)
      .hasName(input.name)
      .hasDni(input.dni)
      .hasPhone(input.phone)
      .hasEmail(input.email)
      .hasAddress(input.address)
      .hasBirthDate(input.birthDate)
      .hasOccupation(input.occupation)
      .hasNotes(input.notes)
      .hasNationality(input.nationality);
  });

  test('should create a new lead with only required fields', async () => {
    const input = jane();
    const item = await addLead(input);
    assertLead(item)
      .hasName(input.name)
      .hasDni(input.dni)
      .hasPhone(input.phone)
      .hasEmail(null)
      .hasAddress(null)
      .hasBirthDate(null)
      .hasOccupation(null)
      .hasNotes(null)
      .hasNationality(null);
  });

  test('should reject duplicate dni', async () => {
    const existing = await addLead(john());
    await addLead(
      john({ dni: existing.dni }),
      createConflictError(`A lead with DNI ${existing.dni} already exists`)
    );
  });

  describe('Property validations', () => {
    const testCases = [
      {
        name: 'should reject empty name',
        input: john({ name: emptyText }),
        expectedError: createValidationError([
          validationError.tooSmall('name', 1),
        ]),
      },
      {
        name: 'should reject name longer than 200 characters',
        input: john({ name: bigText(201) }),
        expectedError: createValidationError([
          validationError.tooBig('name', 200),
        ]),
      },
      {
        name: 'should reject missing name',
        input: john({ name: undefined }),
        expectedError: createValidationError([
          validationError.requiredString('name'),
        ]),
      },
      {
        name: 'should reject empty dni',
        input: john({ dni: emptyText }),
        expectedError: createValidationError([
          validationError.tooSmall('dni', 1),
        ]),
      },
      {
        name: 'should reject dni longer than 20 characters',
        input: john({ dni: bigText(21) }),
        expectedError: createValidationError([
          validationError.tooBig('dni', 20),
        ]),
      },
      {
        name: 'should reject missing dni',
        input: john({ dni: undefined }),
        expectedError: createValidationError([
          validationError.requiredString('dni'),
        ]),
      },
      {
        name: 'should reject empty phone',
        input: john({ phone: emptyText }),
        expectedError: createValidationError([
          validationError.tooSmall('phone', 1),
        ]),
      },
      {
        name: 'should reject phone longer than 20 characters',
        input: john({ phone: bigText(21) }),
        expectedError: createValidationError([
          validationError.tooBig('phone', 20),
        ]),
      },
      {
        name: 'should reject missing phone',
        input: john({ phone: undefined }),
        expectedError: createValidationError([
          validationError.requiredString('phone'),
        ]),
      },
      {
        name: 'should reject invalid email format',
        input: john({ email: 'not-an-email' }),
        expectedError: createValidationError([
          validationError.invalidEmail('email'),
        ]),
      },
      {
        name: 'should reject email longer than 100 characters',
        input: john({ email: `${bigText(91)}@email.com` }),
        expectedError: createValidationError([
          validationError.tooBig('email', 100),
        ]),
      },
      {
        name: 'should reject address longer than 1000 characters',
        input: john({ address: bigText(1001) }),
        expectedError: createValidationError([
          validationError.tooBig('address', 1000),
        ]),
      },
      {
        name: 'should reject occupation longer than 100 characters',
        input: john({ occupation: bigText(101) }),
        expectedError: createValidationError([
          validationError.tooBig('occupation', 100),
        ]),
      },
      {
        name: 'should reject nationality longer than 50 characters',
        input: john({ nationality: bigText(51) }),
        expectedError: createValidationError([
          validationError.tooBig('nationality', 50),
        ]),
      },
    ];

    for (const { name, input, expectedError } of testCases) {
      test(name, async () => {
        await addLead(input, expectedError);
      });
    }
  });
});
