import type { KycStatusValue } from '../../domain/kyc-status';

export interface GetProfileResponseDto {
  id: string;
  firebaseUid: string;
  email: string;
  alias?: string;
  kycStatus: KycStatusValue;
  role: string;
  createdAt: string;
}
