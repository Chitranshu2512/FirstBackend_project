import mongoose from "mongoose";
import { DB_NAME } from "../contacts.js";

mongoose.set('strictQuery', true);

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)

        console.log(`\nMongoDB connected!! DB Host ${connectionInstance.connection.host}`)
    } catch (error) {
        console.log("failed")
        console.log("ERR:", error)
    }
}


export default connectDB