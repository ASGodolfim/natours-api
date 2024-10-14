const express = require('express');

const tourRouter = require(`./routes/tourRoutes`);
const userRouter = require(`./routes/userRoutes`);

const app = express();

app.use(express.json());
app.use(express.static(`${__dirname}/public/`));
app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
});


app.use('api/v1/tours', tourRouter);
app.use('api/v1/users', userRouter);

module.exports = app;