const express = require('express');
const controller = require('./../controller/userController')
const authController = require('./../controller/authController')

const router = express.Router();

router.post('signup', authController.signup);

router
    .route('/')
    .get(controller.getAllUsers);

router
    .route('/:id')
    .get(controller.getUserById)
    .patch(controller.updateUser)
    .delete(controller.deleteUser);

    module.exports = router;