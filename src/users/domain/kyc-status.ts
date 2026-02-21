export const KycStatus = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
} as const;

export type KycStatusValue = (typeof KycStatus)[keyof typeof KycStatus];

export const KYC_STATUS_VALUES: KycStatusValue[] = ['PENDING', 'APPROVED', 'REJECTED'];
