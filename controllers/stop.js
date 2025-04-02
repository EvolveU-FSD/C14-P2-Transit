const mongodb = require('../data/database');
const { ObjectId } = require('mongodb'); // Add this for ObjectId

const stopSchema = {
    TELERIDE_NUMBER: String,
    STATUS: String,  
    CREATE_DT_UTC: String,
    MOD_DT_UTC: String,
    GLOBALID: String,
    POINT: String    
};

const DATABASE_NAME = "Transit";
const COLLECTION_NAME = "Stop";

const getStopModel = () => {
    const db = mongodb.getDatabase();
    return db.models[COLLECTION_NAME] || db.model(COLLECTION_NAME, stopSchema, COLLECTION_NAME);

};
const getAllStops = async (req, res) => {
    try {
        const Stop = getStopModel();
        const results = await Stop.find().exec();

        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(results);
    } catch (err) {
        console.error('Error fetching stops:', err);
        res.status(500).json({ message: err.message });
    }
};

const getSingleStop = async (req, res) => {
    try {
        const Stop = getStopModel();
        const stop = await Stop.findById(req.params.id).exec();

        if (!stop) {
            return res.status(404).json({ message: 'Stop not found' });
        }

        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(stop);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

module.exports = {
    getAllStops,
    getSingleStop,
};