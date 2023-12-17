const express = require('express')
const router = express.Router();
const authRouter = require('./auth/index');
const userRouter = require('./user/index');
const adminRouter = require('./admin/index');
const {isLogged, isAdmin} = require("../middlewares/auth");
const error = require('./../middlewares/error');

router.use('/auth', authRouter);
router.use('/user', isLogged, userRouter);
router.use('/admin', isLogged, isAdmin, adminRouter);

router.use(error);

module.exports = router;