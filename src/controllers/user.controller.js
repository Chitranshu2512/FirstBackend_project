import { asyncHandler } from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import { User } from "../models/user.model.js"

export const registerUser = asyncHandler(async(req, res) => {

// STEPS TO REGISTER A USER:-
    // get user details from the frontend
    // validate the fields - not empty
    // check is user already exist - username, email
    // check for the images, check for avatar
    // upload images to cloudinary,
    // create user object(instance), create entry in DB
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
    const existedUser = await User.findOne({
        $or: [{ userName }, { email }]
    })
    if(existedUser) throw new ApiError(409, "User with email or username already exist")








})

export const loginUser = asyncHandler(async(req, res) => {
    // Steps to login a user
    // get credentials from the frontend (userName or Email)
    // check the authorization of the user (Find user and check password)
    // generate access and refresh token 
    // send cookie


    const {email, userName, password} = req.body
    // if credentials are blank
    if(!userName || !email){
        return new ApiError(400, "username or email is required")
    }
    // find user based on email or userName
    const user = await User.findOne({
        $or : [{userName}, {email}]
    })

    // if could not get the desired User
    if(!user){
        return new ApiError(404, "User does not exist")
    }

    // decrypt the password and check
    const isPasswordValid = user.isPasswordCorrect(password)

    // if wrong password
    if(!isPasswordValid){
        return new ApiError(404, "Bad Credentials")
    }

    

})






export const greetUser = asyncHandler((req, res) => {
    res.send({
        message: "we registered a new user successfully"
    })
})

