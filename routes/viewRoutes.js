const express = require('express');
const controller = require('../controller/viewController');

const router = express.Router();

router.get('/base', controller.getBase);
router.get('/', controller.getOverview);
router.get('/overview', controller.getCard);
router.get('/tour/:slug', controller.getTour);
router.get('/login', controller.getLogin);

module.exports = router;