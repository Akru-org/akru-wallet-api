import { Email } from './value-objects/email.vo';
import { UserId } from './value-objects/user-id.vo';

export type KycStatus = 'PENDING' | 'APPROVED' | 'REJECTED';
export type UserRole = 'USER' | 'ADMIN';

export class User {
  private constructor(
    readonly id: UserId,
    readonly firebaseUid: string,
    readonly email: Email,
    readonly kycStatus: KycStatus,
    readonly role: UserRole,
    readonly createdAt: Date,
    readonly alias?: string,
  ) {}

  static create(params: { 
    id: UserId;
    firebaseUid: string;
    email: Email;
    kycStatus?: KycStatus;
    role?: UserRole;
    createdAt?: Date;
    alias?: string;
  }): User {
    const { id, firebaseUid, email, alias } = params;
    
    return new User(
      id,
      firebaseUid,
      email,  
      params.kycStatus ?? 'PENDING',  
      params.role ?? 'USER',
      params.createdAt ?? new Date(),
      alias,
    );
  }

  static reconstitute(params: {
    id: UserId;
    firebaseUid: string;
    email: Email;
    kycStatus: KycStatus;
    role: UserRole;
    createdAt: Date;
    alias?: string;
  }): User {
    const { id, firebaseUid, email, kycStatus, role, createdAt, alias } = params;
    const firebaseUidTrimmed = firebaseUid?.trim() ?? '';
    if (firebaseUidTrimmed.length === 0) {
      throw new Error('Firebase UID cannot be empty');
    }
    const validStatuses: KycStatus[] = ['PENDING', 'APPROVED', 'REJECTED'];
    if (!validStatuses.includes(kycStatus)) {
      throw new Error(`Invalid kycStatus: ${kycStatus}`);
    }
    const validRoles: UserRole[] = ['USER', 'ADMIN'];
    if (!validRoles.includes(role)) {
      throw new Error(`Invalid role: ${role}`);
    }
    return new User(id, firebaseUidTrimmed, email, kycStatus, role, createdAt, alias);
  }
}
