const Tour = require('./../models/tourModel');
const APIFeature = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const factory = require('./handlerFactory');

exports.getAllTours = catchAsync(async (req, res, next) => {

    const features = new APIFeature(Tour.find(), req.query).filter().sort().limitFields().pagination();
    const tours = await features.query;

    res.status(200).json(
        {
            status: 'succsess',
            results: tours.length,
            data: {
                tours
            }
        }
    );
});

exports.getTourById = factory.findOne(Tour, {path: 'review', select: '-__v -tour'});
exports.createTour = factory.createOne(Tour);
exports.updateTour = factory.updateOne(Tour);
exports.deleteTour = factory.deleteOne(Tour);

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingAverage,price';
  req.query.fields  = 'name,price,ratingsAverage,summary,dificulty';
  next();
};
exports.getTourStats = catchAsync(async (req, res, next) => {

    const stats = await Tour.aggregate([
        {
            $match: { ratingsAverage: { $gte: 4.5 } }
        },
        {
            $group: {
            _id: { $toUpper: 'difficulty'},
            numTours: { $sum: 1},
            numRating: { $sum: '$ratingsQuantity'},
            avgRating: { $avg: '$ratingsAverage' },
            avgPrice: { $avg: '$price' },
            minPrice: { $min: '$price' },
            maxPrice: { $max: '$price' }
            }
        },
        {
            $sort: { avgPrice: 1 }
        }
    ]);

    res.status(200).json(
        {
            status: 'success',
            data:{
                stats
            }
        }
    );
});
exports.getMonthlyPlan = catchAsync(async (req, res, next) => {

    const year = req.params.year * 1;

    const plan = await Tour.aggregate([
        {
            $unwind: '$startDates'
        },
        {
            $match: {
                startDates: {
                    $gte: new Date(`${year}-01-01`),
                    $lte: new Date(`${year}-12-31`),    
                }
            }
        },
        {
            $group: {
                _id: { $month: '$startDate' },
                numTourStarts: { $sum: 1 },
                tours: { $push: '$name' }
            }
        },
        {
            $addFields: { month: '$_id' }
        },
        {
            $project: {
                _id: 0
            }
        },
        {
            $sort: { numTourStarts: -1 }
        },
        {
            $limit: 12
        }
    ]);

    res.status(200).json(
        {
            status: 'success',
            data:{
                plan
            }
        }
    );
});

