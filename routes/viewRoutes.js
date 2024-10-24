const express = require('express');
const controller = require('../controller/viewController');

const router = express.Router();

router.get('/', controller.getBase)
router.get('/overview', controller.getOverview);
router.get('/tour/:slug', controller.getTour);
router.get('/login', controller.getLogin);

module.exports = router;