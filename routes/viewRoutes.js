const express = require('express');
const controller = require('../controller/viewController');
const authController = require('../controller/authController');
const bookingController = require('../controller/bookingController');

const router = express.Router();


router.get('/',bookingController.createBookingCheckout, authController.isLoggedIn, controller.getOverview);
router.get('/tour/:slug', authController.isLoggedIn, controller.getTour);

router.get('/login', authController.isLoggedIn, controller.getLogin);
router.get('/account', authController.protect, controller.getAccount);

router.get('/my-tours', authController.protect, controller.getMyTours)

module.exports = router;