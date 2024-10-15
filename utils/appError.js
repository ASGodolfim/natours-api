class AppError extends Error {
    constructor(message, stautsCode){
        super(message);

        this.stautsCode = stautsCode;
        this.status = `${stautsCode}`.startsWith('4') ? ' fail' : 'error';
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = AppError;