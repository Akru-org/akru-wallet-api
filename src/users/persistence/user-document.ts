export interface UserDocument {
  _id: string;
  firebaseUid: string;
  email: string;
  kycStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
  role: 'USER' | 'ADMIN';
  createdAt: Date;
  updatedAt: Date;
  alias?: string;  
}
