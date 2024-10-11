const express = require('express');
const controller = require('./../controller/tourController')

const router = express.Route();

router
    .route('/')
    .get(controller.getAllTours)
    .post(controller.createTour);

router
    .route('/:id')
    .get(controller.getTourById);

module.exports = router;