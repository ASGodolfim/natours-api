const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const factory = require('./handlerFactory');
const multer = require('multer');

const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/img/users');
    },
    filename: (req, file, cb) => {
        const ext = file.mimetype.split('/'[1]);
        cb(null, `user-${req.user.id}-${Date.now()}.${ext}}`);
    }
});
const multerFilter = (req, file, cb) => {
    if(file.mimetype.startsWith('image')) {
        cb(null, true);
    } else {
        cb(new AppError('Not an image! Please upload only images.', 400), false)
    }
};
const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter
});
exports.uploadUserPhoto = upload.single('photo');

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
    if(req.file) filteredBody.photo = req.file.filename
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