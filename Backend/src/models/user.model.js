import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
    unique: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
  },
  targetRole: {
    type: String,
    default: "XYZ",
  },
  collegeName: {
    type: String,
    default: "XYZ",
  },
  currentYear: {
    type: Number,
    required: [true, "Current year is required"],
    min: [1, "Current year must be between 1 and 4"],
    max: [4, "Current year must be between 1 and 4"],
    // validate: {
    //   validator: Number.isInteger,
    //   message: "Current year must be a whole number",
    // },
  },
  leetcodeName: {
    type: String,
    // will be unique for all users naturally,secondly if i want to access my lc from 2-3 emails then unique will not allow
  },
  gfgName: {
    type: String,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  verified: {
    type: Boolean,
    default: false,
  },
});

const userModel = new mongoose.model("Users", userSchema);

export default userModel;
