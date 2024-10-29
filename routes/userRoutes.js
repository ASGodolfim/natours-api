const express = require('express');
const controller = require('./../controller/userController')
const authController = require('./../controller/authController')
const multer = require('multer');

const router = express.Router();

const upload = multer({dest: 'public/img/users'});

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logout);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);
router.patch('/updateMyPassword', authController.protect, authController.updatePassword);

router.get('/me', authController.protect, controller.getMe, controller.getUserById);
router.patch('/updateMe', upload.sungle('photo'), authController.protect, controller.updateMe);
router.delete('/deleteMe',authController.protect, controller.deleteMe);

router
    .route('/')
    .get(controller.getAllUsers);

router
    .route('/:id')
    .get(controller.getUserById)
    .patch(authController.protect, authController.restrictTo('admin'), controller.updateUser)
    .delete(authController.protect, authController.restrictTo('admin'), controller.deleteUser);

    module.exports = router;