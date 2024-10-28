const { promisify } = require('util');
const crypto = require('crypto');
const catchAsync = require('../utils/catchAsync');
const User = require('./../models/userModel');
const jwt = require('jsonwebtoken');
const AppError = require('./../utils/appError');
const sendEmail = require('./../utils/email');
const { token } = require('morgan');

const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);

    const cookieOptions = { 
        expiresAt: new Date(Date.now() + process.env.JWT_COOKIES_EXPIRES_IN * 24 * 60 * 1000),
        httpOnly: true
    }
    if(process.env.NODE_ENV === 'production') cookieOptions.secure = true;
    res.cookie('jwt', token, cookieOptions); 

    res.status(statusCode).json(
        {
            status: 'success',
            token,
            data: {
                user
            }
        }
    );
}

const signToken = id => {
    return jwt.sign( { id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN});
};

exports.signup = catchAsync(async (req, res, next) => {
    const newUser = await User.create({
        username: req.body.username,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
        passwordChangedAt: req.body.passwordChangedAt,
        name: req.body.name,
        email: req.body.email,
        age: req.body.age,
        photo: req.body.photo
    });

    createSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
    const {email, password} = req.body;

    if (!email) {
        next(new AppError('Please provide a email', 400));
    } else if (!password) {
        next(new AppError('Please provide a password', 400));
    }
    const user = await User.findOne({ email }).select('+password')

    if( await user.correctPassword(password, user.password)) {
        createSendToken(user, 200, res);
    } else {
        return next(new AppError('Incorrect username/email or password', 401));
    }
    
});

exports.protect = catchAsync(async (req, res, next) => {
    let token;
    if (req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer '))
    {
        token = req.headers.authorization.split(' ')[1];
    } else if(req.cookies.jwt) {
        token = req.cookies.jwt;
    }
    if(!token){
        return next(new AppError('Please Log in First', 401));
    }

    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET)
    
    const freshUser = await User.findById(decoded.id).select('+passwordChangedAt');
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

exports.forgotPassword = catchAsync(async (req, res, next) => {
    const user = await User.findOne( { email: req.body.email } )
    if (!user) {
        return next(new AppError('No user Found', 404));
    }
    const resetToken = user.createPasswordResetToken();
    
    const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;

    const message = `forgot your password? Sumit a PATCH request with yout new password and Password Confirm to ${resetURL}.\nIf you didn't forget your password, please ignore this email`;
    try{
        await sendEmail({
            email: user.email,
            subject: 'Your Password reset token (valid for 10 minutes)',
            message
        });
        res.status(200).json(
            {
                status: 'success',
                message: 'Token sent to email'
            }
        );
    } catch (err) {
        user.passwordResetToken = undefined;
        user.passwordResetExpire = undefined;
        await user.save( { validateBeforeSave: false } );

        return next(new AppError('Error sending the email, please try again later', 500));
    }
});

exports.resetPassword = catchAsync(async(req, res, next) => {
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne({passwordResetExpire: hashedToken, passwordResetExpire: {$gt: Date.now()}});
    
    if (!user) {
        return next(new AppError('Token invalid or expired', 400));
    }

    user.password = req.body.password;
    user.passwordConfirm = req.passwordConfirm;
    user.passwordResetExpire = undefined;
    user.passwordResetToken = undefined;
    await user.save();
    createSendToken(user, 200, res);
});

exports.updatePassword = catchAsync(async(req, res, next) => {
    const user = await User.findById(req.user._id).select('+password');
    if (!user) return next(new AppError('User not found', 404));

    if(await user.correctPassword(req.body.passwordCurrent, user.password)){
        user.password = req.body.password;
        user.passwordConfirm = req.body.passwordConfirm;
        await user.save();
        createSendToken(user, 200, res);
    } else return next(new AppError('Invalid Password'), 401)
});

exports.isLoggedIn = catchAsync(async (req, res, next) => {
     if(req.cookies.jwt) {

        const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET)
        
        const currentUser = await User.findById(decoded.id).select('+passwordChangedAt');
        
        if (!currentUser){
            return next();
        }
        res.locals.user = currentUser;
        return next();
    }
    next();
});
