const express = require('express');
const controller = require('./../controller/reviewController')
const authController = require('./../controller/authController')
const router = express.Router({ mergeParams: true});

router
    .route('/')
    .get(controller.getAllReviews)
    .post(authController.protect, authController.restrictTo('user'), controller.createReview);

router.route('/:id').delete(authController.protect, controller.deleteReview);
