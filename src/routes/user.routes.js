import { Router } from "express";
import { registerUser, greetUser } from "../controllers/user.controller.js";
import { loginUser } from "../controller/user_controller.js";

const router = Router();

router.route("/register").post(registerUser)
router.route("/login").post(loginUser)
router.route("/greet").get(greetUser) 

// router.route("/register"): This specifies that the following HTTP method will be associated with the /register route.

export default router;