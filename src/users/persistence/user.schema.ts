import { Schema } from 'mongoose';
import { UserDocument } from './user-document';

export const UserSchema = new Schema<UserDocument>(
  {
    _id: { type: String, required: true },
    firebaseUid: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    kycStatus: {
      type: String,
      required: true,
      enum: ['PENDING', 'APPROVED', 'REJECTED'],
    },
    role: { type: String, required: true, enum: ['USER', 'ADMIN'] },

    alias: { type: String, required: false },
  },
  { timestamps: true, _id: true },
);

export const USER_MODEL_NAME = 'User';
