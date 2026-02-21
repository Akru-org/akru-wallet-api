import { Email } from '../domain/value-objects/email.vo';
import { User } from '../domain/user.entity';
import type { KycStatus, UserRole } from '../domain/user.entity';
import { UserId } from '../domain/value-objects/user-id.vo';
import type { UserDocument } from './user-document';

export class UserMapper {
  static toDomain(doc: UserDocument): User {
    return User.reconstitute({
      id: UserId.create(doc._id.toString()),
      firebaseUid: doc.firebaseUid,
      email: Email.create(doc.email),
      kycStatus: doc.kycStatus as KycStatus,
      role: doc.role as UserRole,
      createdAt: doc.createdAt,
      alias: doc.alias,
    });
  }

  static toPersistence(user: User): {
    id: string;
    firebaseUid: string;
    email: string;
    kycStatus: KycStatus;
    role: UserRole;
    createdAt: Date;
    alias?: string;
  } {
    return {
      id: user.id.value,
      firebaseUid: user.firebaseUid,
      email: user.email.value,
      kycStatus: user.kycStatus,
      role: user.role,
      createdAt: user.createdAt,
      alias: user.alias,
    };
  }
}
