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
const createStopTime = async (req, res) => {
    try {
        const StopTime = getStopTimeModel();
        const newStopTime = new StopTime(req.body);
        await newStopTime.save();

        res.setHeader('Content-Type', 'application/json');
        res.status(201).json(newStopTime);
    } catch (err) {
        console.error('Error creating stop time:', err);
        res.status(500).json({ message: err.message });
    }
};

const updateStopTime = async (req, res) => {
    try {
        const StopTime = getStopTimeModel();
        const stopTime = await StopTime.findById(req.params.id).exec();

        if (!stopTime) {
            return res.status(404).json({ message: 'Stop time not found' });
        }

        Object.assign(stopTime, req.body);
        await stopTime.save();

        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(stopTime);
    } catch (err) {
        console.error('Error updating stop time:', err);
        res.status(500).json({ message: err.message });
    }
}
const deleteStopTime = async (req, res) => {
    try {
        const StopTime = getStopTimeModel();
        const stopTime = await StopTime.findById(req.params.id).exec();

        if (!stopTime) {
            return res.status(404).json({ message: 'Stop time not found' });
        }

        await stopTime.remove();

        res.setHeader('Content-Type', 'application/json');
        res.status(204).json();
    } catch (err) {
        console.error('Error deleting stop time:', err);
        res.status(500).json({ message: err.message });
    }
};
const getStopTimesByTripId = async (req, res) => {
    try {
        const StopTime = getStopTimeModel();
        const stopTimes = await StopTime.find({ TRIP_ID: req.params.tripId }).exec();

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
        const stopTimes = await StopTime.find({ STOP_ID: req.params.stopId }).exec();

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
    createStopTime,
    updateStopTime,
    deleteStopTime,
    getStopTimesByTripId,
    getStopTimesByStopId
}