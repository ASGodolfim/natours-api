const Review = require('./../models/reviewModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const factory = require('./handlerFactory');

exports.createReview = catchAsync(async (req, res, next) => {
    if(!req.body.tour) req.body.tour = req.params.tourId;
    if(!req.body.user) req.body.user = req.params.userId;
    const newReview = await Review.create(req.body);

    res.status(201).json(
        {
            status: 'succsess',
            data: {
                Review: newReview
            }
        }   
    );    
});
exports.getAllReviews = catchAsync(async (req, res, next) => {
    let filter = {}
    if(req.params.tourId) filter = {tour : req.params.tourId}

    const features = new APIFeature(Review.find(filter), req.query).filter().sort().limitFields().pagination();
    const reviews = await features.query;

    res.status(200).json(
        {
            status: 'succsess',
            results: reviews.length,
            data: {
                reviews
            }
        }
    );
});

exports.deleteReview = factory.deleteOne(Review);