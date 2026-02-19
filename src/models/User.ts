import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  image?: string;
  providerId: string;
  role: "admin" | "user";
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, index: true },
    image: { type: String },
    providerId: { type: String, required: true, unique: true , index: true},
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
      index: true,
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);