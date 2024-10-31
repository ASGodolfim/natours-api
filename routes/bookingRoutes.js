const express = require('express');
const controller = require('./../controller/bookingController');
const authController = require('./../controller/authController');
const router = express.Router();

router.get(
    '/checkout-session/:tourId',
    authController.protect,
    controller.getCheckoutSession
);

router.use(authController.protect, authController.restrictTo('lead', 'admin'));

router.route('/')
    .get(controller.getAllBookings)
    .post(controller.createBooking);
router.route('/:bookingId')
    .get(controller.getBooking)
    .patch(controller.updateBooking)
    .delete(controller.deleteBooking);

module.exports = router;