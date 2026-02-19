import mongoose, { Schema, Document, Model } from "mongoose";

export interface ITask extends Document {
  planId: mongoose.Types.ObjectId;
  title: string;
  estimatedMinutes?: number;
  createdAt: Date;
  updatedAt: Date;
}

const TaskSchema = new Schema<ITask>(
  {
    planId: {
      type: Schema.Types.ObjectId,
      ref: "Plan",
      required: true,
      index: true,
    },
    title: { type: String, required: true, trim: true },
    estimatedMinutes: Number,
  },
  { timestamps: true }
);

TaskSchema.index({ planId: 1 });

export default (mongoose.models.Task as Model<ITask>) ||
  mongoose.model<ITask>("Task", TaskSchema);
