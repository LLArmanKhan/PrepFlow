import mongoose from "mongoose";

const goalSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: [true, "User Id is required"],
    },
    title: {
      type: String,
      required: [true, "Title Is Required"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    unit: {
      type: String,    // prblems, topics, questions, etc
      required: [true, "Unit is required"],
    },
    currentValue: {
      type: Number,
      default: 0,
      min: [0, "Current value cannot be negative"],
    },
    targetValue: {
      type: Number,
      required: [true, "Target Value Is Required"],
      min: [1, "Target Value must be atleast 1"],
    },
    // will calculate percentage on the frontend
    targetDate: {
      type: Date,
      required: [true, "Target Date is required"],
    },
    status: {
      type: String,
      enum: ["Active", "Completed"],
      default: "Active",
    },
  },
  {
    timestamps: true,
  },
);

const goalModel = mongoose.model("Goals", goalSchema);

export default goalModel;
