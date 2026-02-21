import type { KycStatusValue } from '../../domain/kyc-status';

export interface UpdateKycBodyDto {
  kycStatus: KycStatusValue;
}

export interface UpdateKycResponseDto {
  id: string;
  firebaseUid: string;
  email: string;
  alias?: string;
  kycStatus: KycStatusValue;
  role: string;
  createdAt: string;
}
