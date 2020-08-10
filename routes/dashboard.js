const path = require('path');

const express = require('express');
const { getDashboard } = require('../controllers/affiliates');

const router = express.Router();

router.get('/dashboard', getDashboard);

module.exports = router;