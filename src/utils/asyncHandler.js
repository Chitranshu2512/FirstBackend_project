
// Wrap asynchronous express route handlers with a clean approach

// 1st way :-


const asyncHandler = (requestHandeler) => {
        (req, res, next) => {
            Promise.resolve(requestHandeler(req, res, next)).catch((error) => next(err))
        }
}








// 2nd way :-

// const asyncHandler = (func) => {
//     return async (req, res, next) => {
//         try {
//             await func(req, res, next);
//         } catch (error) {
//             res.status(error.code || 500).json({
//                 success: false,
//                 message: error.message
//             })
//         }
//     }
// }

