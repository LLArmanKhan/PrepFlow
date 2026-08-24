import mongoose from "mongoose";
import config from "./config.js";

async function connectDB() {
    try{
        await mongoose.connect(config.MONGO_URI)
        console.log("DB Connected");
    }
    catch(err){
        console.error("Error Connecting to Database : ",err.message)
    }
}


export default connectDB