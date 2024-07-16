class ApiError extends Error{
    constructor(statusCode, message = "something went wrong", errors = [], stack = null){
            super(message)
            this.statusCode = statusCode
            this.message = message
            this.data = null
            this.errors = errors
            this.success = false
            this.stack = stack
    }
}


export {ApiError}