const axios = require('axios');

const fileDataToArray = require('./../helper/fileDataToArray');
const calculateDistance = require('./../helper/calculateDistance');

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
            airport: item[1],
            city: item[2],
            country: item[3],
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

            flight.id = flights.length + 1;

            flights.push(flight);
        });

        return flights;
    } catch (error) {
        console.log(error);
    }
};

const getFlightsDistance = async () => {
    try {
        const flights = await getFlights();

        const flightsDistance = flights
            .map((flight) => {
                if (flight.source && flight.destination)
                    return {
                        flightId: flight.id,
                        distance: Math.ceil(
                            calculateDistance(
                                flight.source.lat,
                                flight.source.long,
                                flight.destination.lat,
                                flight.destination.long
                            )
                        ),
                    };
            })
            .filter((item) => item)
            .sort((a, b) => a.distance - b.distance)
            .reverse();
        return flightsDistance;
    } catch (error) {
        console.log(error);
    }
};

const getTenLongestFlights = async () => {
    const flights = await getFlights();
    const flightsDistance = await getFlightsDistance();

    const tenLongestFlights = [];
    flightsDistance
        .filter((item, index) => index < 10)
        .forEach((longFlight) => {
            flights.forEach((item) => {
                if (item.id === longFlight.flightId)
                    tenLongestFlights.push({ ...item, distance: longFlight.distance });
            });
        });

    return tenLongestFlights;
};

const getTenShortestFlights = async () => {
    const flights = await getFlights();
    const flightsDistance = await getFlightsDistance();

    const tenShortestFlights = [];
    flightsDistance
        .reverse()
        .filter((item, index) => index < 10)
        .forEach((longFlight) => {
            flights.forEach((item) => {
                if (item.id === longFlight.flightId)
                    tenShortestFlights.push({ ...item, distance: longFlight.distance });
            });
        });

    return tenShortestFlights;
};

const getFlightByID = async (id) => {
    const flights = await getFlights();
    const flightsDistance = await getFlightsDistance();

    const flightBydId = [];
    flightsDistance
        .forEach((longFlight) => {
            flights.filter(el => el.id === id).map((item) => {
                if (item.id === longFlight.flightId)
                    flightBydId.push({ ...item, distance: longFlight.distance });
            });
        });

    return flightBydId;
}

module.exports = {getFlights, getFlightByID, getTenLongestFlights, getTenShortestFlights}
