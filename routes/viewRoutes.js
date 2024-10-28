const express = require('express');
const controller = require('../controller/viewController');
const authController = require('../controller/authController');

const router = express.Router();

router.use(authController.isLoggedIn);

router.get('/base', controller.getBase);
router.get('/', controller.getOverview);
router.get('/tour/:slug', controller.getTour);
router.get('/login', controller.getLogin);

module.exports = router;