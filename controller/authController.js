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