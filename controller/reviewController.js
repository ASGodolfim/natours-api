const Review = require('./../models/reviewModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError')

exports.createReview = catchAsync(async (req, res, next) => {
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

    const features = new APIFeature(Review.find(), req.query).filter().sort().limitFields().pagination();
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