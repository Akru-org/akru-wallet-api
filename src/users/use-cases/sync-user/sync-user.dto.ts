export interface SyncUserDto {
  id: string;
  firebaseUid: string;
  email: string;
  alias?: string;
  kycStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
  role: 'USER' | 'ADMIN';
  createdAt: string;
}
