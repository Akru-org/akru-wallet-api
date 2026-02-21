import { Inject, Injectable } from '@nestjs/common';
import { User } from '../../domain/user.entity';
import type { UserRepository } from '../../domain/user.repository';
import type { UpdateUserResponseDto } from './update-user.dto';

@Injectable()
export class UpdateUserUseCase {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
  ) {}

  async execute(params: { firebaseUid: string; alias: string }): Promise<UpdateUserResponseDto> {
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
      kycStatus: existing.kycStatus,
      role: existing.role,
      createdAt: existing.createdAt,
      alias: params.alias?.trim() ?? existing.alias ?? '',
    });

    const saved = await this.userRepository.save(updated);
    return this.toDto(saved);
  }

  private toDto(user: User): UpdateUserResponseDto {
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
