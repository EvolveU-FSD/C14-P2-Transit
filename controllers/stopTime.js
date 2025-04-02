const mongodb = require('../data/database');
const { ObjectId } = require('mongodb'); // Add this for ObjectId

const stopTimeSchema = {
    TRIP_ID: String,
    ARRIVAL_TIME: String,
    DEPARTURE_TIME: String,
    STOP_ID: String,
    STOP_SEQUENCE: Number,
    PICKUP_TYPE: Number,
    DROP_OFF_TYPE: Number,
    DISTANCE_TRAVELED: Number,
    CREATE_DT_UTC: String,
    MOD_DT_UTC: String,
    GLOBALID: String
};
const DATABASE_NAME = "Transit";
const COLLECTION_NAME = "StopTime";

const getStopTimeModel = () => {
    const db = mongodb.getDatabase();
    return db.models[COLLECTION_NAME] || db.model(COLLECTION_NAME, stopTimeSchema, COLLECTION_NAME);
}
const getAllStopTimes = async (req, res) => {
    try {
        const StopTime = getStopTimeModel();
        const results = await StopTime.find().exec();

        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(results);
    } catch (err) {
        console.error('Error fetching stop times:', err);
        res.status(500).json({ message: err.message });
    }
};
const getSingleStopTime = async (req, res) => {
    try {
        const StopTime = getStopTimeModel();
        const stopTime = await StopTime.findById(req.params.id).exec();

        if (!stopTime) {
            return res.status(404).json({ message: 'Stop time not found' });
        }

        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(stopTime);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getStopTimesByTripId = async (req, res) => {
    try {
        const StopTime = getStopTimeModel();
        const stopTimes = await StopTime.find({ TRIP_ID: req.params.id }).exec();

        if (!stopTimes || stopTimes.length === 0) {
            return res.status(404).json({ message: 'No stop times found for this trip ID' });
        }

        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(stopTimes);
    } catch (err) {
        console.error('Error fetching stop times by trip ID:', err);
        res.status(500).json({ message: err.message });
    }
};
const getStopTimesByStopId = async (req, res) => {
    try {
        const StopTime = getStopTimeModel();
        const stopTimes = await StopTime.find({ STOP_ID: req.params.id }).exec();

        if (!stopTimes || stopTimes.length === 0) {
            return res.status(404).json({ message: 'No stop times found for this stop ID' });
        }

        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(stopTimes);
    } catch (err) {
        console.error('Error fetching stop times by stop ID:', err);
        res.status(500).json({ message: err.message });
    }
};
module.exports = {
    getAllStopTimes,
    getSingleStopTime,
    getStopTimesByTripId,
    getStopTimesByStopId
}