const express = require('express');
const router = express.Router();
const {registerUser, loginUser, profile, validate} = require('../controllers/userController')
const authentication = require('../middlewares/authentication')

router.post('/register', registerUser);
router.post('/login', loginUser)
router.get('/profile', authentication, profile)
router.get('/validate', validate);

module.exports = router;