
const express = require('express');

const authController = require('../controllers/auth');

const router = express.Router();

router.get('/login', authController.getLogin);

router.get('/signup', authController.getSignup);

router.post('/login', );

router.get('/signup', );

router.get('/logout', );

module.exports = router;