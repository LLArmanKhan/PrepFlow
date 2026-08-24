import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Users",
        require:[true,"User Id is required"],
    },
    refreshToken:{
        type:String,
        require:[true,"Refresh Token is required"]
    },
    ip:{
        type:String,
        require:[true,"IP is required"]
    },
    userAgent:{
        type:String,
        require:[true,"UserAgent is required"]
    },
    revoked:{
        type:Boolean,
        default:false
    }
},{
    timestamps:true
})

const sessionModel = new mongoose.model("Sessions",sessionSchema)

export default sessionModel