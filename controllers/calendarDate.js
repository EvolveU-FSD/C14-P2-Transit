const mongodb = require('../data/database');
const { ObjectId } = require('mongodb'); // Add this for ObjectId

const calendarDateSchema = {
    service_id: String,
    date: String,
    exception_type: String
};

const DATABASE_NAME = "Transit";
const COLLECTION_NAME = "Calendar_Date";

const getCalendarDateModel = () => {
    const db = mongodb.getDatabase();
    return db.models[COLLECTION_NAME] || db.model(COLLECTION_NAME, calendarDateSchema, COLLECTION_NAME);
}


const getAllCalendarDates = async (req, res) => {
    try {
        const CalendarDate = getCalendarDateModel();
        const results = await CalendarDate.find().exec();

        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(results);
    } catch (err) {
        console.error('Error fetching routes:', err);
        res.status(500).json({ message: err.message });
    }
};


const getSingleCalendarDate = async (req, res) => {
    try {
        const CalendarDate = getCalendarDateModel();
        const route = await CalendarDate.findOne({ route_id: req.params.id }).exec();

        if (!route) {
            return res.status(404).json({ message: 'Route not found' });
        }

        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(route);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    getAllCalendarDates,
    getSingleCalendarDate,
    getCalendarDateModel
};
