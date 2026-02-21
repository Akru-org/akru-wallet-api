import { Inject, Injectable } from '@nestjs/common';
import { User } from '../../domain/user.entity';
import type { UserRepository } from '../../domain/user.repository';
import type { GetProfileResponseDto } from './get-profile.dto';

@Injectable()
export class GetProfileUseCase {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
  ) {}

  async execute(firebaseUid: string): Promise<GetProfileResponseDto | null> {
    const user = await this.userRepository.findByFirebaseUid(firebaseUid);
    if (!user) return null;
    return this.toDto(user);
  }

  private toDto(user: User): GetProfileResponseDto {
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
