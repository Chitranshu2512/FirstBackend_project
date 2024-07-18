import { asyncHandler } from "../utils/asyncHandler.js"

const registerUser = asyncHandler((req, res) => {
    res.status(200).json({
        message: "we registered a new user successfully"
    })
})
const greetUser = asyncHandler((req, res) => {
    res.send({
        message: "we registered a new user successfully"
    })
})

export {registerUser}
export {greetUser}