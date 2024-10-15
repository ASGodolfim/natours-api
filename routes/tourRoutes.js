const express = require('express');
const controller = require('./../controller/tourController')

const router = express.Router();

router.route('/top-5-cheap').get(tourController.aliasTopTours, tourController.getAllTours);

router
    .route('/')
    .get(controller.getAllTours)
    .post(controller.createTour);

router
    .route('/:id')
    .get(controller.getTourById)
    .put(controller.updateTour)
    .delete(controller.deleteTour);

module.exports = router;