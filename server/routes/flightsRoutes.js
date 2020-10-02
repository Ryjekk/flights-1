const express = require('express');
const flightsController = require('./../controllers/flightsController.js');
const router = express.Router();

router.route('/longest').get(flightsController.getLongestFlights);
router.route('/shortest').get(flightsController.getShortestFlights);
router.route('/').get(flightsController.getAllFlights);
router.route('/:id').get(flightsController.getFlightById);

module.exports = router;
