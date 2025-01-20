import { FieldsErrors } from '../validators/validator-fields.interface';
// {name: ['name must be a string']}

export class ValidationError extends Error {}

export class EntityValidationError extends Error {
  constructor(public errors: FieldsErrors) {
    super('Entity Validation Error');
    this.name = 'EntityValidationError';
  }
}
