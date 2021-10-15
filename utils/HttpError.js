class HttpError extends Error{
    constructor(message,errorCode){
        super()
        this.message = message;
        this.statusCode = errorCode;
    }
}
module.exports = HttpError;