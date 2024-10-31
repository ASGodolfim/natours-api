const express = require('express');
const controller = require('./../controller/bookingController');
const authController = require('./../controller/authController');
const router = express.Router();

router.get(
    '/checkout-session/:tourId',
    authController.protect,
    controller.getCheckoutSession
);

module.exports = router;