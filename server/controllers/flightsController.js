const flightLogic = require('./../logic/flightLogic.js')

exports.getAllFlights = async (req, res) => {
    res.status(200).json(await flightLogic.getFlights());
}

exports.getFlightById = async (req, res) => {
    let id = req.params.id * 1;
    res.status(200).json(await flightLogic.getFlightByID(id))
}

exports.getLongestFlights = async (req, res) => {
    res.status(200).json(await flightLogic.getTenLongestFlights());
}

exports.getShortestFlights = async (req, res) => {
    res.status(200).json(await flightLogic.getTenShortestFlights());
}

