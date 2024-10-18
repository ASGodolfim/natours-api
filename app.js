const express = require('express');
const morgan = require('morgan');
const AppError = require('./utils/appError');
const errorHandler = require('./controller/errorHandler');
const rateLimit = require('express-rate-limit');

const tourRouter = require(`${__dirname}/routes/tourRoutes`);
const userRouter = require(`${__dirname}/routes/userRoutes`);

const app = express();

if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
};

const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'too many requests from this IP, please try again in an hour'
});

app.use('/api', limiter);

app.use(express.json());
app.use(express.static(`${__dirname}/public/`));

app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
});

app.use('api/v1/tours', tourRouter);
app.use('api/v1/users', userRouter);

app.all('*', (req, res , next) => {
    next(new AppError(`can't find ${req.originalUrl} on this server`));
})

app.use(errorHandler);

module.exports = app;