const Review = require('./../models/reviewModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const factory = require('./handlerFactory');

exports.setTourId = (req, res, next) => {
    if(!req.body.tour) req.body.tour = req.params.tourId;
    next();
};
exports.setUserId = (req, res, next) => {
    if(!req.body.user) req.body.user = req.params.userId;
    next();
};
exports.filter = (req, res, next) => {
    let filter = {}
    if(req.params.tourId) filter = {tour : req.params.tourId}
    next();
}

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

exports.findReviewById = factory.findOneO(Review);
exports.createReview = factory.createOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review);