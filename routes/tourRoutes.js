const express = require('express');
const controller = require('./../controller/tourController');
const authController = require('./../controller/authController');
const reviewRouter = require('./../routes/reviewRoutes');
const router = express.Router();

router.use('/:tourId/reviews', reviewRouter);

router
    .route('/')
    .get(authController.protect, controller.getAllTours)
    .post(authController.protect, controller.createTour);

router
    .route('/:id')
    .get(authController.protect, controller.getTourById)
    .patch(authController.protect, controller.updateTour)
    .delete(authController.protect, authController.restrictTo('admin', 'lead'), controller.deleteTour);

router.route('/top-5-cheap').get(authController.protect, controller.aliasTopTours, controller.getAllTours);

router.route('/tour-stats').get(authController.protect, controller.getTourStats);

router.route('/monthly-plan/:year').get(authController.protect, controller.getMonthlyPlan);

module.exports = router;