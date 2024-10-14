const express = require('express');
const controller = require('./../controller/userController')

const router = express.Router();

router
    .route('/')
    .get(controller.getAllUsers)
    .post(controller.createUser);

router
    .route('/:id')
    .get(controller.getUserById)
    .put(controller.updateUser)
    .delete(controller.deleteUser);

    module.exports = router;