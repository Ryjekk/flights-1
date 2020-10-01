const express = require('express');
const axios = require('axios');
const app = express();
const fileDataToArray = require('./helper/fileDataToArray');
const calculateDistance = require('./helper/calculateDistance');

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
      sAirportID: item[3],
      destinationAirportID: item[5],
    }));

    const flights = [];

    routes.forEach((route) => {
      const flight = {};

      airports.forEach((airport) => {
        if (airport.airportID === route.sourceAirportID)
          flight.source = { ...airport };
        if (airport.airportID === route.destinationAirportID)
          flight.destination = airport;
      });

      //   console.log(flight);

      flights.push(flight);
    });

    return flights;
  } catch (error) {
    console.log(error);
  }
};

const getDistance = async () => {
  const flights = await getFlights();
  console.log(flights);
  const routeDistances = flights.map(({ source: s, destination: d }) =>
    calculateDistance(s.lat, s.long, d.lat, d.long)
  );
};

getDistance();

app.get('/api/flights', async (req, res) => {
  res.send(await getFlights());
});

app.get('/api/flights/longest', async (req, res) => {
  res.send(await getDistance());
});

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Server is listening on port ${port}...`));
