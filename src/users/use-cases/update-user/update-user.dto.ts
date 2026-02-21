export interface UpdateUserBodyDto {
  alias: string;
}

export interface UpdateUserResponseDto {
  id: string;
  firebaseUid: string;
  email: string;
  alias?: string;
  kycStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
  role: 'USER' | 'ADMIN';
  createdAt: string;
}
