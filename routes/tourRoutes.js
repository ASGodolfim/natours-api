const express = require('express');
const controller = require('./../controller/tourController')

const router = express.Router();

router
    .route('/')
    .get(controller.getAllTours)
    .post(controller.checkBody, controller.createTour);

router
    .route('/:id')
    .get(controller.getTourById);

module.exports = router;