import { Inject, Injectable } from '@nestjs/common';
import { User } from '../../domain/user.entity';
import type { UserRepository } from '../../domain/user.repository';
import { KYC_STATUS_VALUES } from '../../domain/kyc-status';
import type { UpdateKycResponseDto } from './update-kyc.dto';

@Injectable()
export class UpdateKycUseCase {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
  ) {}

  async execute(params: { firebaseUid: string; kycStatus: string }): Promise<UpdateKycResponseDto> {
    if (!KYC_STATUS_VALUES.includes(params.kycStatus as (typeof KYC_STATUS_VALUES)[number])) {
      const error = new Error('kycStatus inválido');
      (error as Error & { statusCode?: number }).statusCode = 400;
      throw error;
    }
    const existing = await this.userRepository.findByFirebaseUid(params.firebaseUid);
    if (!existing) {
      const error = new Error('Usuario no encontrado');
      (error as Error & { statusCode?: number }).statusCode = 404;
      throw error;
    }

    const updated = User.reconstitute({
      id: existing.id,
      firebaseUid: existing.firebaseUid,
      email: existing.email,
      kycStatus: params.kycStatus as User['kycStatus'],
      role: existing.role,
      createdAt: existing.createdAt,
      alias: existing.alias,
    });

    const saved = await this.userRepository.save(updated);
    return this.toDto(saved);
  }

  private toDto(user: User): UpdateKycResponseDto {
    return {
      id: user.id.value,
      firebaseUid: user.firebaseUid,
      email: user.email.value,
      alias: user.alias,
      kycStatus: user.kycStatus,
      role: user.role,
      createdAt: user.createdAt.toISOString(),
    };
  }
}
