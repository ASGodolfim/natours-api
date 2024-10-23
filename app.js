const express = require('express');
const morgan = require('morgan');
const AppError = require('./utils/appError');
const errorHandler = require('./controller/errorHandler');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const xss = require('xss-clean');
const sanitize = require('express-mongo-sanitize');
const hpp = require('hpp');
const path = require('path');

const tourRouter = require(`${__dirname}/routes/tourRoutes`);
const userRouter = require(`${__dirname}/routes/userRoutes`);

const app = express();

const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'too many requests from this IP, please try again in an hour'
});

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.use(helmet())

app.use('/api', limiter);

app.use(express.json( { limit: '10kb' } ));

app.use(sanitize());

app.use(xss());

app.use(hpp({
    whitelist: 
    ['duration', 'ratingsQuantity' , 'ratingsAverage', 'maxGroupSize', 'difficulty', 'price' ]
}));

if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
};

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
});

app.get('/', (req, res) => {
    res.status(200).render('base', {
        tour: 'The Forest Hiker',
        user: 'Arthur'
    });
})

app.use('api/v1/tours', tourRouter);
app.use('api/v1/users', userRouter);
app.use('api/v1/reviews', reviewRouter);

app.all('*', (req, res , next) => {
    next(new AppError(`can't find ${req.originalUrl} on this server`));
})

app.use(errorHandler);

module.exports = app;