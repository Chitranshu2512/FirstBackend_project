import { asyncHandler } from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import { User } from "../models/user.model.js"

const registerUser = asyncHandler(async(req, res) => {

// STEPS TO REGISTER A USER:-
    // get user details from the frontend
    // validate the fields - not empty
    // check is user already exist - username, email
    // check for the images, check for avatar
    // upload images to cloudinary,
    // create user object, create entry in DB
    // remove password and refresh token from the response
    // check for use creation
    // send the response back to the frontend



    
    const {fullName, email, userName, password} = req.body

    // validation logic 1
    // if(fullName === "") {
    //     throw new ApiError(400, "fullName must required") 
    // }
    
    // if(email === "") {
    //     throw new ApiError(400, "email must required")
    // }

    // if(userName === "") {
        
    //     throw new ApiError(400, "userName must required")
    // }

    // if(password === "") {
        
    //     throw new ApiError(400, "password must required")
    // }


    // validation logic 2
    if([fullName, email, userName, password].some((field) => field === "")){
        throw new ApiError(404, "All fields are required")
        console.log("All fields are required")
    }

    // check if user already exist
    const existedUser = User.findOne({
        $or: [{ userName }, { email }]
    })
    if(existedUser) throw new ApiError(409, "User with email or username already exist")








})








const greetUser = asyncHandler((req, res) => {
    res.send({
        message: "we registered a new user successfully"
    })
})

export {registerUser}
export {greetUser}