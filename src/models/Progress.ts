import mongoose, { Schema, Document, Model } from "mongoose";

export interface IProgress extends Document {
  planId: mongoose.Types.ObjectId;
  taskId: mongoose.Types.ObjectId;
  dayNumber: number;
  date: Date;
  completed: boolean;
  actualMinutesSpent?: number;
}

const ProgressSchema = new Schema<IProgress>(
  {
    planId: {
      type: Schema.Types.ObjectId,
      ref: "Plan",
      required: true,
      index: true,
    },
    taskId: {
      type: Schema.Types.ObjectId,
      ref: "Task",
      required: true,
      index: true,
    },
    dayNumber: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    actualMinutesSpent: Number,
  },
  { timestamps: true }
);

// ✅ ONLY THIS UNIQUE INDEX
ProgressSchema.index(
  { planId: 1, taskId: 1, dayNumber: 1 },
  { unique: true }
);

ProgressSchema.index({ planId: 1, dayNumber: 1 });

export default (mongoose.models.Progress as Model<IProgress>) ||
  mongoose.model<IProgress>("Progress", ProgressSchema);