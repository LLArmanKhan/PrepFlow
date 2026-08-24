import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
    email:{
        type:String,
        require:[true,"Email Is Required"]
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        require:[true,"User Id is required"],
    },
    hashotp:{
        type:String,
        require:[true,"OTP is required"],
        unique:true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 600
    }
},{
    timestamps:true   // to make otp expire in 10 min later on
})

const otpModel = new mongoose.model("OTP",otpSchema)

export default otpModel