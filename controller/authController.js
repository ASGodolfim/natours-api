const { promisify } = require('util')
const catchAsync = require('../utils/catchAsync');
const User = require('./../models/userModel');
const jwt = require('jsonwebtoken');
const AppError = require('./../utils/appError');

const signToken = id => {
    return jwt.sign( { id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN});
}

exports.signup = catchAsync(async (req, res, next) => {
    const newUser = await User.create({
        username: req.body.username,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
        name: req.body.name,
        email: req.body.email,
        age: req.body.age,
        photo: req.body.photo
    });

    const token = signToken(newUser._id);

    res.status(201).json(
        {
            status: 'success',
            token,
            data: {
                user: newUser
            }
        }
    )
});

exports.login = catchAsync(async (req, res, next) => {
    const {email, password, username} = req.body;

    if (!email || !username) {
        next(new AppError('Please provide a Username or email', 400));
    } else if (!password) {
        next(new AppError('Please provide a password', 400));
    }
    if(username) {
        const user = await User.findOne({ username }).select('+password')
    } else {
        const user = await User.findOne({ email }).select('+password')
    }

    if(!user || !user.correctPassword(password, user.password)) {
        return next(new AppError('Incorrect username/email or password', 401));
    }

    const token = signToken(user._id);

    res.status(201).json(
        {
            status: 'success',
            token
        }
    )
});

exports.protect = catchAsync(async (req, res, next) => {
    let token;
    if  (req.headers.authorization &&
         req.headers.authorization.startsWith('Bearer ')){
            token = req.headers.authorization.split(' ')[1];
         }
    if (!token){
        return next(new AppError('Please Log in First', 401));
    }

    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET)
    
    const freshUser = User.findById(decoded.id).select('+passwordChangedAt');
    if (!freshUser){
        return next(new AppError('No user found please log again', 401));
    }
    if(freshUser.changedPasswordAfter(decoded.iat)){
        return next(new AppError('User recently changed password please log in again', 401));
    }
    req.user = freshUser;
    next();
});

exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next (new AppError('You dont have permission for this', 403));
        }
        next();
    };
};