import jwt from "jsonwebtoken"
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js"


export const verifyJWTToken = asyncHandler(async(req, res, next) => {

    try {
        // collect access token from HTTP req obj
        // mobile application that interact with the API and uses internet do not have or send the accessToken or cookies, they just send a custom header with req obj so we are handeling that also
    
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
    
    
        // if req obj does not have token
        if(!token){
            throw new ApiError(401, "unauthorized access")
        }
    
        // if token found then verify the authenticity
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    
    
        // find user with user id that decoded accesToken is having.
        const user = await User.findById(decodedToken._id).select("-password -refershToken")
    
    
        // if user from that id is not in DB that means token does not clear the authenticity 
        if(!user){
            throw new ApiError(401, "invalid access token")
        }
    
    
        // if user is authorized then add that user object into the req obj that came from the frontend
        req.user = user
    
        next();
    } 
    catch (error) {
        throw new ApiError(401, error?.message || "invalid access token")
    }
})