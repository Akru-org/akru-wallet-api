import { User } from './user.entity';

export const UserRepository = Symbol('UserRepository');

export interface UserRepository {
  findByFirebaseUid(uid: string): Promise<User | null>;
  save(user: User): Promise<User>;
}
