const express = require('express');
const router = express.Router();
const routeController = require('../controllers/routeControllers');

// Route to calculate optimized routes with multiple stops
router.post('/optimize-route', routeController.optimizeRoute);

// Route to calculate an optimized path between source and destination
router.get('/optimized-path', routeController.getOptimizedPath);

module.exports = router;