const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const factory = require('./handlerFactory');

const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach(el => {
        if (allowedFields.includes(el)) newObj[el] = obj[el];
    });
    return newObj;
};

exports.deleteUser = factory.deleteOne(User);
exports.getUserById = factory.findOne(User);
exports.updateUser = factory.updateOne(User);
exports.getAllUsers = factory.findAll(User);

exports.getMe = (req, res, next) => {
    req.params.id = req.user.id;
    next();
}
exports.updateMe = catchAsync(async (req, res, next) => {
    if (req.body.password || req.body.passwordConfirm){
        return next(new AppError('please use update password for updating the password'), 400);
    }
    const filteredBody = filterObj(req.body, 'name', 'email')
    const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {new: true, runValidators: true})

    res.status(200).json(
        {
            status: 'success',
            data: {
                user: updatedUser
            }
        }
    )
});
exports.deleteMe = catchAsync(async (req,res,next) => {
    await User.findByIdAndUpdate(req.user.id, {active: false});
    res.status(204).json(
        {
            status: 'success',
            data: null
        }
    )
});



/*
exports.createUser = catchAsync(async (req, res, next) => {
    const newUser = await User.create(req.body);

    res.status(201).json(
        {
            status: 'succsess',
            data: {
                user: newUser
            }
        }   
    );    
});
*/