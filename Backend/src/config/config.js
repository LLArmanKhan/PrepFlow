import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: path.resolve(import.meta.dirname, "../../.env") });

if(!process.env.DB_URI){
    throw new Error("DataBase URI is not defined in Environmental Variables")
}

if(!process.env.JWT_SECRETKEY){
    throw new Error("JWT KEY is not defined in Environmental Variables")
}

if(!process.env.GOOGLE_CLIENT_ID){
    throw new Error("Client ID is not defined in Environmental Variables")
}

if(!process.env.GOOGLE_CLIENT_SECRET){
    throw new Error("Client Secret is not defined in Environmental Variables")
}

if(!process.env.GOOGLE_REFRESH_TOKEN){
    throw new Error("Refresh Token is not defined in Environmental Variables")
}

if(!process.env.GOOGLE_ID){
    throw new Error("Google ID is not defined in Environmental Variables")
}

if(!process.env.GEMINI_API){
    throw new Error("Gemini API is not defined in Environmental Variables")
}

if(!process.env.PORT){
    throw new Error("PORT is not defined in Environmental Variables")
}

const config = {
    MONGO_URI:process.env.DB_URI,
    JWT_SECRET:process.env.JWT_SECRETKEY,
    CLIENT_ID:process.env.GOOGLE_CLIENT_ID,
    CLIENT_SECRET:process.env.GOOGLE_CLIENT_SECRET,
    REFRESH_TOKEN:process.env.GOOGLE_REFRESH_TOKEN,
    GOOGLE_ID:process.env.GOOGLE_ID,
    GEMINI_API:process.env.GEMINI_API,
    PORT:process.env.PORT
}


export default config