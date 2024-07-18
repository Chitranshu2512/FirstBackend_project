import { Router } from "express";
import { registerUser, greetUser } from "../controllers/user.controller.js";

const router = Router();

router.route("/register").post(registerUser) 
router.route("/greet").get(greetUser) 

// router.route("/register"): This specifies that the following HTTP method will be associated with the /register route.

export default router;