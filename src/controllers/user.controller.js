import { asyncHandler } from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import { User } from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"


const generateAccessAndRefreshToken = async(userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refershToken = refreshToken
        await user.save({validateBeforeSave: false})
        return {accessToken, refreshToken}
        
    } catch (error) {
        throw new ApiError(500, "something went wrong while generating tokens")
    }
}

// register controller
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
    //investigate what does the req.files holds
    console.log("req.file's data: ",req.files)
    console.log("req.file.avatar's data: ",req.files.avatar)
    
    const coverImageLocalPath = req.files?.coverImage[0]?.path


    if(!avatarLocalPath) throw new ApiError(400, "Avatar file is required");
    
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    if(!avatar) throw new ApiError(400, "Avatar file is required");
    

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


// login controller
export const loginUser = asyncHandler(async(req, res) => {
    // Steps to login a user
    // get credentials from the frontend (userName or Email)
    // check the authorization of the user (Find user and check password)
    // generate access and refresh token 
    // send cookie


    const {email, userName, password} = req.body

    // if credentials are blank
    if(!userName && !email){
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

    // check password
    if(!isPasswordValid){
        throw new ApiError(404, "Bad Credentials")
    }

    // generate Access and refresh token
    const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id)

    /*  
    NOW:- 
    we will have to fetch the user again bcoz refresh token has been added so our prev 'user' variable was not having refresh token as the time of variable declaration.

    if we want to save one DB query to save our time then we can update the refreshToken field in our 'user' variable itself (eg:- user.refreshToken = refreshToken)

    but if one new DB query is not expensive for your website then its recommended to get the updated user from the database
    */
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    // declare a option obj to send it with cookies as response
    const options = {
        httpOnly: true,
        secure: true    // these two properties define that cookie is only modifiable from the server, not client
    }


    // finally if all things are good then send the response back to the user with the "access and refresh token" as the cookies


    return res.status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(200, {loggedInUser,accessToken,refreshToken}, "user logged in successfully")
    )  // its is good to send some respone(JSON data) to the user, it may be useful for him.

})


// logout controller
export const logout = asyncHandler(async(req, res) => {

    // as this controller will have the access after execution of auth middleware in which we are adding a user obj inside req obj. so here we can access that user obj


    // clear the refresh token store in the database
    await User.findByIdAndUpdate(req.user._id, 
        {   
            // this is special mmongoDB syntax to find and uodate at a same time
            $set: {refershToken : undefined}
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true 
    }

    // clear the cookies stored in the user's browser and send the response back to user
    return res.status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "user logged out"))    
})


// refreshToken Controller
export const refreshAccessToken = asyncHandler(async(req, res) => {
    
    //get the refreshToken from the req obj
    const incomingRefreshToken = req.cookie?.refreshToken || req.body.refreshToken

    // if req obj does not carry refresh token
    if(!incomingRefreshToken){
        throw new ApiError(401, "unauthorized request")
    }
    // deocde the token
    const decodedToken = JWT.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)

    // find a user (if exist) with id that decodeToken has in the payload section 
    const user = User.findById(decodedToken._id)

    // if user not exist with that id 
    if(!user){
        throw new ApiError(401, "Invalid refresh Token")
    }

    // if user found, then match the saved refresh Token with incomingtoken then generate the new Tokens
    if(incomingRefreshToken != user.refershToken){{
        throw new ApiError(401, "unauthorized request")
    }}

    const {accessToken, newRefreshToken} = await  generateAccessAndRefreshToken(user._id);

    const options = {
        httpOnly: true,
        secure: true 
    }
    res.status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken",newRefreshToken , options)
    .json(new ApiResponse(200, {accessToken, refreshToken: newRefreshToken }, 
        "Access token refreshed"
    ))

})
