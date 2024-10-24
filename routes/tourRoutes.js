const express = require('express');
const controller = require('./../controller/tourController');
const authController = require('./../controller/authController');
const reviewRouter = require('./../routes/reviewRoutes');

const router = express.Router();

router.use('/:trainId/reviews', reviewRouter)

router
    .route('/')
    .get(controller.getAllTours)
    .post(authController.protect, authController.restrictTo('admin'), controller.createTour);

router
    .route('/:id')
    .get(controller.getTourById)
    .patch(authController.protect, authController.restrictTo('admin', 'lead'),  controller.updateTour)
    .delete(authController.protect, authController.restrictTo('admin', 'lead'), controller.deleteTour);

router.route('/top-5-cheap').get(authController.protect, controller.aliasTopTours, controller.getAllTours);

router.route('/tour-stats').get(authController.protect, controller.getTourStats);

router.route('/tours-within/:distance/center/:latlng/unit/:unit').get(authController.protect, controller.getToursWithin);

router.route('/distances/:latlng/unit/:unit').get(controller.getDistances);

router.route('/monthly-plan/:year').get(authController.protect, controller.getMonthlyPlan);

module.exports = router;