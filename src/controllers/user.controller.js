import { asyncHandler } from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import { User } from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"



const generateAccessAndRefreshToken = async(userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refershToken = user.generateRefreshToken()

        user.refershToken = refershToken
        await user.save({validateBeforeSave: false})
        return {accessToken, refershToken}
        
    } catch (error) {
        throw new ApiError(500, "something went wrong while generating tokens")
    }
}


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
        
    }

    // check if user already exist
    const existedUser = await User.findOne({
        $or: [{ userName }, { email }]
    })
    if(existedUser) throw new ApiError(409, "User with email or username already exist")

    const avatarLocalPath = req.files?.avatar[0]?.path
    const coverImageLocalPath = req.files?.coverImage[0]?.path


    if(!avatarLocalPath) throw new ApiError(400, "Avatar file is required");
    else console.log("Avatar found: ", avatarLocalPath)
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    if(!avatar) throw new ApiError(400, "Avatar file is required");
    else console.log("avatar uploaded on cloud")

    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        userName: userName.toLowerCase()
    })
    
    const createdUser = await User.findById(user._id).select("-password -refreshToken")

    if(!createdUser){
        throw new ApiError(500, "something went wrong while registering user")
    }


    return res.status(201).json(
        new ApiResponse(200, createdUser, "user registered successfully")
    )
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
        throw new ApiError(400, "username or email is required")
    }
    // find user based on email or userName
    const user = await User.findOne({
        $or : [{userName}, {email}]
    })

    // if could not get the desired User
    if(!user){
        throw new ApiError(404, "User does not exist")
    }

    // decrypt the password and check
    const isPasswordValid = user.isPasswordCorrect(password)

    // if wrong password
    if(!isPasswordValid){
        throw new ApiError(404, "Bad Credentials")
    }

    // generate Access and refresh token
    const {accessToken, refershToken} = await generateAccessAndRefreshToken(user._id)
    

})


export const greetUser = asyncHandler((req, res) => {
    res.send({
        message: "we registered a new user successfully"
    })
})

