const path = require('path');

const express = require('express');
const { getAffiliate } = require('../controllers/affiliates');

const router = express.Router();

router.get('/', getAffiliate)

module.exports = router;