import { Router } from "express";
import { registerUser, greetUser, loginUser } from "../controllers/user.controller.js";
import {upload}  from "../middlewares/multer.middelware.js"

const router = Router();

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


router.route("/login").post(loginUser)
router.route("/greet").get(greetUser) 

// router.route("/register"): This specifies that the following HTTP method will be associated with the /register route.

export default router;