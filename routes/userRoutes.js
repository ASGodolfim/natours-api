const express = require('express');
const controller = require('./../controller/userController')

const router = express.Router();

router
    .route('/')
    .get(controller.getAllUsers);

    module.export = router;