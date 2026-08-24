import mongoose from "mongoose";

const progressSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Users",
        required:[true,"UserId is required"]
    },
    subject:{
        type:String,
        required:[true,"Subject Name is required"],
        trim:true,
        uppercase:true
    },
    topic:{
        type:String,
        required:[true,"Topic Name is required"],
        trim:true
    },
    completionType:{
        type:String,
        enum:["manual","Ai_Test"],
        default:"manual"
    },
    aiTestScore: {
      type: Number,
      min: 0,
      max: 10,
      default: null,
    },
    completedAt:{
        type:Date,
        default:Date.now
    }
},{
    timestamps:true
})

const progressModel = new mongoose.model("progress",progressSchema)

export default progressModel