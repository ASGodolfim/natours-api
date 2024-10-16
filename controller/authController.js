const catchAsync = require('../utils/catchAsync');
const User = require('./../models/userModel');
const jwt = require('jsonwebtoken');

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

    const token = jwt.sign({ id: newUser._id}, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN});

    res.status(201).json(
        {
            status: 'success',
            token,
            data: {
                user: newUser
            }
        }
    )
})