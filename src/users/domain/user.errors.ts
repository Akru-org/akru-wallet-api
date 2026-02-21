export class InvalidEmailError extends Error {
  constructor(value: string) {
    super(`Invalid email format: ${value}`);
    this.name = 'InvalidEmailError';
    Object.setPrototypeOf(this, InvalidEmailError.prototype);
  }
}
