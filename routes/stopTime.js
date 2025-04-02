const express = require('express');
const router = express.Router();   
const stopTimeController = require('../controllers/stopTime');
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
};
const deleteStopTime = async (req, res) => {
    try {
        const StopTime = getStopTimeModel();
        const stopTime = await StopTime.findById(req.params.id).exec();

        if (!stopTime) {
            return res.status(404).json({ message: 'Stop time not found' });
        }

        await stopTime.remove();

        res.setHeader('Content-Type', 'application/json');
        res.status(204).json({ message: 'Stop time deleted' });
    } catch (err) {
        console.error('Error deleting stop time:', err);
        res.status(500).json({ message: err.message });
    }
};  
router.get('/', stopTimeController.getAllStopTimes);
router.get('/:id', stopTimeController.getSingleStopTime);
router.post('/', stopTimeController.createStopTime);
router.put('/:id', stopTimeController.updateStopTime);
router.delete('/:id', stopTimeController.deleteStopTime);
module.exports = router;
const express = require('express');
const router = express.Router();
const stopTimeController = require('../controllers/stopTime');
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
};
const deleteStopTime = async (req, res) => {
    try {
        const StopTime = getStopTimeModel();
        const stopTime = await StopTime.findById(req.params.id).exec();

        if (!stopTime) {
            return res.status(404).json({ message: 'Stop time not found' });
        }

        await stopTime.remove();

        res.setHeader('Content-Type', 'application/json');
        res.status(204).json({ message: 'Stop time deleted' });
    } catch (err) {
        console.error('Error deleting stop time:', err);
        res.status(500).json({ message: err.message });
    }
};
router.get('/', stopTimeController.getAllStopTimes);
router.get('/:id', stopTimeController.getSingleStopTime);
router.post('/', stopTimeController.createStopTime);
router.put('/:id', stopTimeController.updateStopTime);
router.delete('/:id', stopTimeController.deleteStopTime);
module.exports = router;
const express = require('express');
const router = express.Router();
const stopTimeController = require('../controllers/stopTime');
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
};
const deleteStopTime = async (req, res) => {
    try {
        const StopTime = getStopTimeModel();
        const stopTime = await StopTime.findById(req.params.id).exec();

        if (!stopTime) {
            return res.status(404).json({ message: 'Stop time not found' });
        }

        await stopTime.remove();

        res.setHeader('Content-Type', 'application/json');
        res.status(204).json({ message: 'Stop time deleted' });
    } catch (err) {
        console.error('Error deleting stop time:', err);
        res.status(500).json({ message: err.message });
    }
};
router.get('/', stopTimeController.getAllStopTimes);
router.get('/:id', stopTimeController.getSingleStopTime);
router.post('/', stopTimeController.createStopTime);
router.put('/:id', stopTimeController.updateStopTime);
router.delete('/:id', stopTimeController.deleteStopTime);
module.exports = router;
const express = require('express');
const router = express.Router();
const stopTimeController = require('../controllers/stopTime');
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
