const catchAsync = require('./../utils/catchAsync');
const APIFeature = require('./../utils/apiFeatures');
const AppError = require('./../utils/appError');

exports.deleteOne = Model => catchAsync(async (req, res, next) => {

    const doc = await Model.findByIdAndDelete(req.params.id);

    if(!doc) {
        return next(new AppError(`No document found with that ID`, 404));
    }

    res.status(204).json(
        {
        status: 'success',
        data: null
        }
    );
});
exports.updateOne = Model => catchAsync(async (req, res, next) => {

    if(!doc) {
        return next(new AppError('No document found with that ID', 404));
    }
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })
    res.status(200).json(
        {
            status: 'success',
            data: {
                data: doc
            }
        }
    );
});
exports.createOne = Model => catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);

    res.status(201).json(
        {
            status: 'succsess',
            data: {
                data: doc
            }
        }   
    );    
});
exports.findOne = (Model, popOptions) => catchAsync(async (req, res, next) => {
    let query =  await Model.findById(req.params.id);
    if (popOptions) query.poulate(popOptions);
    const doc = await query;

    if(!doc) {
        return next(new AppError('No document found with that ID', 404));
    }

    res.status(200).json(
        {
            status: 'succsess',
            data: {
                tour
            }
        }
    );
});
exports.findAll = Model => catchAsync(async (req, res, next) => {
    let filter = {}
    if(req.params.tourId) filter = {tour : req.params.tourId}

    const features = new APIFeature(Review.find(filter), req.query).filter().sort().limitFields().pagination();
    const reviews = await features.query;

    res.status(200).json(
        {
            status: 'succsess',
            results: doc.length,
            data: {
                data: doc
            }
        }
    );
});
