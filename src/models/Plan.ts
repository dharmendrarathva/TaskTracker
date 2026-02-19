import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPlan extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  totalDays: number;
  startDate: Date;
  endDate: Date;
  dailyTimeLimitMinutes?: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PlanSchema = new Schema<IPlan>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: { type: String, required: true, trim: true },

    totalDays: { type: Number, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },

    dailyTimeLimitMinutes: Number,

    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

PlanSchema.index({ userId: 1 });
PlanSchema.index({ startDate: 1 });
PlanSchema.index({ endDate: 1 });

export default (mongoose.models.Plan as Model<IPlan>) ||
  mongoose.model<IPlan>("Plan", PlanSchema);
