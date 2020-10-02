const express = require('express');
const flightsController = require('./../controllers/flightsController.js');
const router = express.Router();

router
    .route('/flights')
    .get(flightsController.getAllFlights);

router
    .route('/flights/:id')
    .get(flightsController.getFlightById);

router
    .route('/longest')
    .get(flightsController.getLongestFlights);

router
    .route('/shortest')
    .get(flightsController.getShortestFlights);

module.exports = router;
