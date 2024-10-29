const Tour = require('../models/tourModel');
const User = require('../models/userModel');
const AppError = require('../utils/appError');
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

    if (!tour) {
        return next(new AppError('No Tour Found', 404))
    }
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

exports.getAccount = (req, res) => {
    res.status(200).set(
        'Content-Security-Policy',
        "connect-src 'self' http://127.0.0.1:3000/ ws://127.0.0.1:62690/;"
        ).render('account',{
        title: 'Account',
    });
};

exports.updateUserData = catchAsync(async (req, res, next) => {
    const updatedUser = await User.findByIdAndUpdate(req.user.id, {
        name: req.body.name,
        email: req.body.email
    },
    {
        new: true,
        runValidators: true
    });
    console.log(updatedUser);
    res.status(200).set(
        'Content-Security-Policy',
        "connect-src 'self' http://127.0.0.1:3000/ ws://127.0.0.1:62690/;"
        ).render('account',{
        title: 'Account',
        user: updatedUser
    });
});