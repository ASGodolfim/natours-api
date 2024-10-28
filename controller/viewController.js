const Tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');

exports.getOverview = catchAsync(async (req, res, next) => {
    const tours = await Tour.find();
    res.status(200).set(
        'Content-Security-Policy',
        "connect-src 'self' http://127.0.0.1:3000/ ws://127.0.0.1:62690/;"
        ).render('overview', {
        title: 'All Tours',
        tours
    });
});
exports.getTour = catchAsync(async (req, res, next) => {
    const tour = await Tour.findOne({slug: req.params.slug}).populate({
        path: 'reviews',
        fields: 'review rating user'
    });
    res.status(200).set(
        'Content-Security-Policy',
        "connect-src 'self' http://127.0.0.1:3000/ ws://127.0.0.1:62690/;"
        ).render('tour',{
        title: `${tour.name} Tour`,
        tour
    });
});
exports.getLogin = catchAsync(async (req, res, next) => {
    res.status(200).set(
        'Content-Security-Policy',
        "connect-src 'self' http://127.0.0.1:3000/ ws://127.0.0.1:62690/;")
        .render('login', {
        title: 'Log into your account'
    })
});
exports.getBase = catchAsync(async (req, res, next) => {
    const tours = await Tour.find();
    res.status(200).render('base', {
        title: 'All Tours',
        tours
    });    
});