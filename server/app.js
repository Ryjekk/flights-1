const express = require('express');
const axios = require('axios');
const app = express();
const fileDataToArray = require('./helper/fileDataToArray');

const url = {
  airport:
    'https://raw.githubusercontent.com/jpatokal/openflights/master/data/airports.dat',
  routes:
    'https://raw.githubusercontent.com/jpatokal/openflights/master/data/routes.dat',
};

const getFlights = async () => {
  try {
    const { data: airportData } = await axios.get(url.airport);
    const { data: routesData } = await axios.get(url.routes);

    const airports = fileDataToArray(airportData).map((item) => ({
      airportID: item[0],
      name: item[2],
      lat: item[6],
      long: item[7],
    }));

    const routes = fileDataToArray(routesData).map((item) => ({
      sourceAirportID: item[3],
      destinationAirportID: item[5],
    }));

    const flights = [];

    routes.forEach((route) => {
      const flight = {};

      airports.forEach((airport) => {
        if (airport.airportID === route.sourceAirportID)
          return (flight.source = airport);
      });

      airports.forEach((airport) => {
        if (airport.airportID === route.destinationAirportID)
          return (flight.destination = airport);
      });

      flights.push(flight);
    });

    return flights;
  } catch (error) {
    console.log(error);
  }
};

app.get('/api/flights', async (req, res) => {
  res.send(await getFlights());
});

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Server is listening on port ${port}...`));
