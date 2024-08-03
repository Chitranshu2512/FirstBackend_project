import { Router } from "express";
import { registerUser, loginUser, logout, refreshAccessToken, changePassword } from "../controllers/user.controller.js";
import {upload}  from "../middlewares/multer.middelware.js"
import { verifyJWTToken } from "../middlewares/auth.middleware.js";

// create a router instance from express
const router = Router();                 


// implement register route
router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    registerUser)

// login route
router.route("/login").post(loginUser)

// logout route
router.route("/logout").post(verifyJWTToken, logout)

// refresh-token route
router.route("/refresh-token").post(refreshAccessToken)

// change password route
router.route("/changePassword").post(verifyJWTToken, changePassword)


//get current user route
router.route("/getCurrentUser").post(verifyJWTToken, getCurrentUser)




export default router;