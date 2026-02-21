import { InvalidEmailError } from '../user.errors';

const EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

export class Email {
  private readonly _value: string;

  private constructor(value: string) {
    this._value = value;
  }

  get value(): string {
    return this._value;
  }

  static create(value: string): Email {
    const trimmed = value?.trim() ?? '';
    if (trimmed.length === 0) {
      throw new InvalidEmailError(value);
    }
    if (!EMAIL_REGEX.test(trimmed)) {
      throw new InvalidEmailError(value);
    }
    return new Email(trimmed.toLowerCase());
  }

  equals(other: Email): boolean {
    return this._value === other._value;
  }
}
