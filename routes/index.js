const express = require('express');
const router = express.Router();
const userRouter = require('./userRoutes');
const sessionRouter = require('./sessionRoutes');

router.use('/user', userRouter);
router.use('/session', sessionRouter);


module.exports = router