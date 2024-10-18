const express = require('express');
const controller = require('./../controller/userController')
const authController = require('./../controller/authController')

const router = express.Router();

router.post('signup', authController.signup);
router.post('/login', authController.login);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);
router.patch('/updateMyPassword', authController.protect, authController.updatePassword);

router
    .route('/')
    .get(controller.getAllUsers);

router
    .route('/:id')
    .get(controller.getUserById)
    .patch(controller.updateUser)
    .delete(controller.deleteUser);

    module.exports = router;