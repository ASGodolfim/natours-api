const express = require('express');
const controller = require('../controller/viewController');
const authController = require('../controller/authController');
const userController = require('../controller/userController');

const router = express.Router();


router.get('/', authController.isLoggedIn, controller.getOverview);
router.get('/tour/:slug', authController.isLoggedIn, controller.getTour);

router.get('/login', authController.isLoggedIn, controller.getLogin);
router.get('/account', authController.protect, controller.getAccount);
router.post('/updateMe',authController.protect, userController.updateMe);

module.exports = router;