import { test, describe } from 'node:test';
import {
  addClient,
  editClient,
  alice,
  bob,
  assertClient,
} from './client-dsl.js';
import {
  emptyText,
  bigText,
  createValidationError,
  createConflictError,
  validationError,
  createNotFoundError,
} from '../../errors.js';

describe('Edit Client Endpoint', () => {
  test('should edit an existing client with valid data', async () => {
    const created = await addClient(alice());
    const input = bob();
    const updated = await editClient(created.clientId, {
      clientId: created.clientId,
      name: input.name,
      dni: input.dni,
      phone: input.phone,
      email: input.email,
      address: input.address,
    });
    assertClient(updated)
      .hasName(input.name)
      .hasDni(input.dni)
      .hasPhone(input.phone)
      .hasEmail(input.email)
      .hasAddress(input.address);
  });

  test('should return 404 for non-existent client', async () => {
    const id = '01940b6d-1234-7890-abcd-ef1234567890';
    const input = alice();
    await editClient(
      id,
      {
        clientId: id,
        name: input.name,
        dni: input.dni,
        phone: input.phone,
        email: input.email,
        address: input.address,
      },
      createNotFoundError(`Client ${id} not found`)
    );
  });

  test('should reject duplicate dni when editing to another clients dni', async () => {
    const clientA = await addClient(alice());
    const clientB = await addClient(alice());
    await editClient(
      clientB.clientId,
      {
        clientId: clientB.clientId,
        name: clientB.name,
        dni: clientA.dni,
        phone: clientB.phone,
        email: clientB.email,
        address: clientB.address,
      },
      createConflictError(`A client with DNI ${clientA.dni} already exists`)
    );
  });

  test('should allow editing a client keeping the same dni', async () => {
    const created = await addClient(alice());
    const updated = await editClient(created.clientId, {
      clientId: created.clientId,
      name: 'Updated Name',
      dni: created.dni,
      phone: created.phone,
      email: created.email,
      address: created.address,
    });
    assertClient(updated).hasName('Updated Name').hasDni(created.dni);
  });

  test('should reject invalid UUID in param', async () => {
    const input = alice();
    await editClient(
      'invalid-uuid',
      {
        clientId: 'invalid-uuid',
        name: input.name,
        dni: input.dni,
        phone: input.phone,
        email: input.email,
        address: input.address,
      },
      createValidationError([validationError.invalidUuid('clientId')])
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
    ];

    for (const { name, override, expectedError } of testCases) {
      test(name, async () => {
        const created = await addClient(alice());
        await editClient(
          created.clientId,
          {
            clientId: created.clientId,
            name: created.name,
            dni: created.dni,
            phone: created.phone,
            email: created.email,
            address: created.address,
            ...override,
          },
          expectedError
        );
      });
    }
  });
});
