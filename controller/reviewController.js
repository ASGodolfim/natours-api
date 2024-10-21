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

exports.getAllReviews = factory.findAll(Review);
exports.findReviewById = factory.findOneO(Review);
exports.createReview = factory.createOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review);