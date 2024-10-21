const express = require('express');
const controller = require('./../controller/reviewController')
const authController = require('./../controller/authController')
const router = express.Router();

router
    .route('/')
    .get(controller.getAllReviews)
    .post(authController.protect, authController.restrictTo('user'), controller.createReview);
