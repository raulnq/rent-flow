import { test, describe } from 'node:test';
import { addLead, editLead, john, jane, assertLead } from './lead-dsl.js';
import {
  emptyText,
  bigText,
  createValidationError,
  createConflictError,
  validationError,
  createNotFoundError,
} from '../../errors.js';

describe('Edit Lead Endpoint', () => {
  test('should edit an existing lead with valid data', async () => {
    const created = await addLead(john());
    const input = jane();
    const updated = await editLead(created.leadId, {
      leadId: created.leadId,
      name: input.name,
      dni: input.dni,
      phone: input.phone,
      email: input.email,
      address: input.address,
      birthDate: input.birthDate,
      occupation: input.occupation,
      notes: input.notes,
      nationality: input.nationality,
    });
    assertLead(updated)
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

  test('should return 404 for non-existent lead', async () => {
    const id = '01940b6d-1234-7890-abcd-ef1234567890';
    const input = john();
    await editLead(
      id,
      {
        leadId: id,
        name: input.name,
        dni: input.dni,
        phone: input.phone,
        email: input.email,
        address: input.address,
        birthDate: input.birthDate,
        occupation: input.occupation,
        notes: input.notes,
        nationality: input.nationality,
      },
      createNotFoundError(`Lead ${id} not found`)
    );
  });

  test('should reject duplicate dni when editing to another leads dni', async () => {
    const leadA = await addLead(john());
    const leadB = await addLead(john());
    await editLead(
      leadB.leadId,
      {
        leadId: leadB.leadId,
        name: leadB.name,
        dni: leadA.dni,
        phone: leadB.phone,
        email: leadB.email,
        address: leadB.address,
        birthDate: leadB.birthDate,
        occupation: leadB.occupation,
        notes: leadB.notes,
        nationality: leadB.nationality,
      },
      createConflictError(`A lead with DNI ${leadA.dni} already exists`)
    );
  });

  test('should allow editing a lead keeping the same dni', async () => {
    const created = await addLead(john());
    const updated = await editLead(created.leadId, {
      leadId: created.leadId,
      name: 'Updated Name',
      dni: created.dni,
      phone: created.phone,
      email: created.email,
      address: created.address,
      birthDate: created.birthDate,
      occupation: created.occupation,
      notes: created.notes,
      nationality: created.nationality,
    });
    assertLead(updated).hasName('Updated Name').hasDni(created.dni);
  });

  test('should reject invalid UUID in param', async () => {
    const input = john();
    await editLead(
      'invalid-uuid',
      {
        leadId: 'invalid-uuid',
        name: input.name,
        dni: input.dni,
        phone: input.phone,
        email: input.email,
        address: input.address,
        birthDate: input.birthDate,
        occupation: input.occupation,
        notes: input.notes,
        nationality: input.nationality,
      },
      createValidationError([validationError.invalidUuid('leadId')])
    );
  });

  describe('Property validations', () => {
    const testCases = [
      {
        name: 'should reject empty name',
        override: { name: emptyText },
        expectedError: createValidationError([
          validationError.tooSmall('name', 1),
        ]),
      },
      {
        name: 'should reject name longer than 200 characters',
        override: { name: bigText(201) },
        expectedError: createValidationError([
          validationError.tooBig('name', 200),
        ]),
      },
      {
        name: 'should reject invalid email format',
        override: { email: 'not-an-email' },
        expectedError: createValidationError([
          validationError.invalidEmail('email'),
        ]),
      },
      {
        name: 'should reject email longer than 100 characters',
        override: { email: `${bigText(91)}@email.com` },
        expectedError: createValidationError([
          validationError.tooBig('email', 100),
        ]),
      },
      {
        name: 'should reject address longer than 1000 characters',
        override: { address: bigText(1001) },
        expectedError: createValidationError([
          validationError.tooBig('address', 1000),
        ]),
      },
      {
        name: 'should reject occupation longer than 100 characters',
        override: { occupation: bigText(101) },
        expectedError: createValidationError([
          validationError.tooBig('occupation', 100),
        ]),
      },
      {
        name: 'should reject nationality longer than 50 characters',
        override: { nationality: bigText(51) },
        expectedError: createValidationError([
          validationError.tooBig('nationality', 50),
        ]),
      },
    ];

    for (const { name, override, expectedError } of testCases) {
      test(name, async () => {
        const created = await addLead(john());
        await editLead(
          created.leadId,
          {
            leadId: created.leadId,
            name: created.name,
            dni: created.dni,
            phone: created.phone,
            email: created.email,
            address: created.address,
            birthDate: created.birthDate,
            occupation: created.occupation,
            notes: created.notes,
            nationality: created.nationality,
            ...override,
          },
          expectedError
        );
      });
    }
  });
});
