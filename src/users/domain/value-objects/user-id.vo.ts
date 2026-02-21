export class UserId {
  private readonly _value: string;

  private constructor(value: string) {
    this._value = value;
  }

  get value(): string {
    return this._value;
  }

  static create(value: string): UserId {
    const trimmed = value?.trim() ?? '';
    if (trimmed.length === 0) {
      throw new Error('User id cannot be empty');
    }
    return new UserId(trimmed);
  }

  equals(other: UserId): boolean {
    return this._value === other._value;
  }
}
