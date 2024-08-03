import express from "express"
import cookieParser from "cookie-parser";
import cors from "cors"

const app = express();



app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded())
app.use(express.static("public"))
app.use(cookieParser())



import userRouter from "./routes/user.routes.js"

// we are using middle-ware to reach any route that has prefix '/api/v1/user', app.use will send the flow to userRouter function when we hit given end point.

app.use("/api/v1/user", userRouter)

/* it will handle the route as eg:
* https://localhost:8000/api/v1/user/register(any-end-point)
*/

export {app}