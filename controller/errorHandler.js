const AppError = require("../utils/appError");

const sendErrorDev = (err,req, res) => {
    if(req.originalUrl.startsWith('/api')){
        res.status(err.statusCode).json(
            {
                status: err.status,
                message: err.message,
                stack: err.stack,
                error: err
            }
        )
    } else {
        res.status(err.statusCode).render('error', {
            title: 'Something went wroneg',
            msg: err.message
        })
    }

};
const sendErrorProd = (err, res) => {
    if(req.originalUrl.startsWith('/api')){
        if(err.isOperational) {
                res.status(err.statusCode).render('error', {
                title: 'Something went wroneg',
                msg: err.message
            })
        }
        console.error('ERROR', err);

        return res.status(err.statusCode).render('error', {
            title: 'Something went wroneg',
            msg: 'Please try again later'
        })
    }
    
};
const handleCastErrorDB = err => {
    const message = `Invalid ${err.path}: ${err.value}.`;
    return new AppError(message, 400);
};
const handleDuplicateFieldsDB = err => {
    const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
    const message = `Duplicate field value: ${value} please use another.`;
    return new AppError(message, 400);
};
const handleValidationErrorDB = err => {
    const errors = Object.values(err.errors).map(el => el.message);
    const message = `Invalid input data ${errors.join('. ')}.`;
    return new AppError(message, 400);
};
const handleJWTErrorDB = err => new AppError('Invalid token', 401);

const handleJWTExpiredErrorDB = err => new AppError('Token Expired', 401);

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, req, res);
    }
    else if (process.env.NODE_ENV === 'production'){
        let error = {...err};

        if (error.name === 'CastError') error = handleCastErrorDB(error);
        if (error.code === 11000) error = handleDuplicateFieldsDB(error);
        if (error.name === 'ValidationError') error = handleValidationErrorDB(error);
        if (error.name === 'JsonWebTokenError') error = handleJWTErrorDB();
        if (error.name === 'TokenExpiredError') error = handleJWTExpiredErrorDB();
        sendErrorProd(error, res)
    }
};