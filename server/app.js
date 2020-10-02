const express = require('express');
const app = express();
const flightRouter = require('./routes/flightsRoutes')

app.use(express.json());

app.use('/api/', flightRouter);

module.exports = app;
