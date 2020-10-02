const express = require('express');
const app = express();
const flightRouter = require('./routes/flightsRoutes');

app.use(express.json());

app.use('/api/flights', flightRouter);

module.exports = app;
