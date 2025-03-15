const express = require('express');
const router = express.Router();
const driverController = require('../controllers/driverController.js');

router.post('/location-and-eta', driverController.getDriverLocationAndETA);

module.exports = router;