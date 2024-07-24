import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"



const userSchema = new mongoose.Schema({
    watchHistory : [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video"
    }],

    userName: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },

    fullName: {
        type: String,
        required: true,
        trim: true,
        index: true
    },

    avatar: {
        type: String,          // url coming from cloudinary
        required: true
    },

    coverImage: {
        type: String,
    },

    password: {
        type: String,
        required: true
    },

    refershToken: {
        type: String,
        required: true
    },



},{timestamps: true})


/*There is a Mongoose pre-save middleware hook. It runs before a user document is saved to the database.

"save" specifies that this middleware should run before the save event.

The callback function uses async because it involves asynchronous operations (hashing the password) */

userSchema.pre("save", async function(next){

    // if password field is not modified then do not change password
    if(!this.isModified("password")) return next()

    // if password field is changes then only change the password otherwise password will get change on every kind of "save" event which we will not want.
    this.password = await bcrypt.hash(this.password, 10)
    next()
})

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}


userSchema.methods.generateAccessToken = function(){
    return jwt.sign({
        _id: this._id,
        email: this.email,
        userName: this.userName,
        fullName: this.fullName
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    }
)
}


userSchema.methods.generateRefreshToken = function(){
    return jwt.sign({
        _id: this._id
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    }
)
}


export const User = mongoose.model("User", userSchema)