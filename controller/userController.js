const User = require('./../models/userModel');
const APIFeature = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError')

const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach(el => {
        if (allowedFields.includes(el)) newObj[el] = obj[el];
    });
    return newObj;
};

exports.getAllUsers = catchAsync(async (req, res, next) => {

    const features = new APIFeature(user.find(), req.query).filter().sort().limitFields().pagination();
    const users = await features.query;

    res.status(200).json(
        {
            status: 'succsess',
            results: users.length,
            data: {
                users
            }
        }
    );
});
exports.getUserById = catchAsync(async (req, res, next) => {

    if(!user) {
        return next(new AppError('No user found with that ID', 404));
    }

    const user = await USer.findById(req.params.id);
    res.status(200).json(
        {
            status: 'succsess',
            data: {
                user
            }
        }
    );
});
exports.updateUser = catchAsync(async (req, res, next) => {

    if(!user) {
        return next(new AppError('No user found with that ID', 404));
    }
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })
    res.status(200).json(
        {
            status: 'success',
            data: {
                user
            }
        }
    );
});
exports.updateMe = catchAsync(async (req, res, next) => {
    if (req.body.password || req.body.passwordConfirm){
        return next(new AppError('please use update password for updating the password'), 400);
    }
    const filteredBody = filterObj(req.body, 'name', 'email', 'username')
    const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {new: true, runValidators: true})

    res.status(200).json(
        {
            status: 'succsess',
            data: {
                user
            }
        }
    )
});
exports.deleteUser = catchAsync(async (req, res, next) => {
    const user = await User.findByIdAndDelete(req.params.id);

    if(!user) {
        return next(new AppError('No user found with that ID', 404));
    }

    res.status(204).json(
        {
        status: 'success',
        data: null
        }
    );
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