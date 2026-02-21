import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../domain/user.entity';
import type { UserRepository } from '../domain/user.repository';
import { UserMapper } from './user.mapper';
import { USER_MODEL_NAME } from './user.schema';
import type { UserDocument } from './user-document';

@Injectable()
export class UserMongoRepository implements UserRepository {
  constructor(
    @InjectModel(USER_MODEL_NAME)
    private readonly model: Model<UserDocument>,
  ) {}

  async findByFirebaseUid(uid: string): Promise<User | null> {
    const doc = await this.model.findOne({ firebaseUid: uid }).exec();
    if (!doc) return null;
    return UserMapper.toDomain(doc as UserDocument);
  }

  async save(user: User): Promise<User> {
    const persistence = UserMapper.toPersistence(user);
    const now = new Date();
    await this.model
      .updateOne(
        { _id: persistence.id },
        {
          $set: {
            firebaseUid: persistence.firebaseUid,
            email: persistence.email,
            kycStatus: persistence.kycStatus,
            role: persistence.role,
            alias: persistence.alias,
            updatedAt: now,
          },
          $setOnInsert: {
            _id: persistence.id,
            createdAt: persistence.createdAt,
          },
        },
        { upsert: true },
      )
      .exec();
    return user;
  }
}
