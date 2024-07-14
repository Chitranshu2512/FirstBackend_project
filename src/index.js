import dotenv from "dotenv";
import connectDB from "./db/index.js";
 
dotenv.config({
    path:'./env'
})
connectDB()


























/* [there are two ways to write DB connection function]
-----------------------------------------------------------------------------
first is the direct most common function statement way.

function connectDB(){
  // put your connection logic
}
connectDB()   // invoke the function

----------------------------------------------------------------------------
 second and recommended ways is using IIFE way 


(async() => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
    } catch (error) {
        console.log("error", error)
    }
})()

*/