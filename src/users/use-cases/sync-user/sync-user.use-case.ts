import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Email } from '../../domain/value-objects/email.vo';
import { User } from '../../domain/user.entity';
import { UserId } from '../../domain/value-objects/user-id.vo';
import type { UserRepository } from '../../domain/user.repository';
import type { SyncUserDto } from './sync-user.dto';

@Injectable()
export class SyncUserUseCase {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
  ) { }

  async execute(params: { firebaseUid: string; email: string; alias: string }): Promise<SyncUserDto> {
    const existing = await this.userRepository.findByFirebaseUid(params.firebaseUid);

    if (existing) {
      return this.toDto(existing);
    }

    const email = Email.create(params.email);
    const user = User.create({
      id: UserId.create(randomUUID()),
      firebaseUid: params.firebaseUid,
      email,
      kycStatus: 'PENDING',
      role: 'USER',
      alias: params.alias,
    });

    const saved = await this.userRepository.save(user);
    return this.toDto(saved);
  }

  private toDto(user: User): SyncUserDto {
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
