const express = require('express');
const controller = require('../controller/viewController');
const authController = require('../controller/authController');

const router = express.Router();

router.get('/account', authController.protect, controller.getAccount);
router.get('/base', controller.getBase);
router.get('/', authController.isLoggedIn, controller.getOverview);
router.get('/tour/:slug', authController.isLoggedIn, controller.getTour);
router.get('/login', authController.isLoggedIn, controller.getLogin);

module.exports = router;