const express = require('express');
const controller = require('./../controller/tourController')

const router = express.Router();

router
    .route('/')
    .get(controller.getAllTours)
    .post(controller.createTour);

router
    .route('/:id')
    .get(controller.getTourById)
    .patch(controller.updateTour)
    .delete(controller.deleteTour);

router.route('/top-5-cheap').get(controller.aliasTopTours, controller.getAllTours);

router.route('/tour-stats').get(controller.getTourStats);

router.route('/monthly-plan/:year').get(controller.getMonthlyPlan);

module.exports = router;