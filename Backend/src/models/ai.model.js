import mongoose from "mongoose";

const aiChatSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: [true, "UserId is required"],
  },
  prompt: {
    type: String,
    required: [true, "Prompt is required"],
  },
  response: {
    type: String,
    required: [true, "AI response is required"],
  }
},{
    timestamps:true
});

const aiChatModel = new mongoose.model("AiChat",aiChatSchema)

export default aiChatModel
