const express = require('express');
const controller = require('./../controller/bookingController')
const authController = require('./../controller/authController')
const router = express.Router({ mergeParams: true});

module.exports = router;