const mongodb = require('../data/database');
const { ObjectId } = require('mongodb'); // Add this for ObjectId

const calendarSchema = {
    service_id: String,
    monday: Number,
    tuesday: Number,
    wednesday: Number,
    thursday: Number,
    friday: Number,
    saturday: Number,
    sunday: Number,
    start_date: String,
    end_date: String
};

const DATABASE_NAME = "Transit";
const COLLECTION_NAME = "Calendar";

const getCalendarModel = () => {
    const db = mongodb.getDatabase();
    return db.models[COLLECTION_NAME] || db.model(COLLECTION_NAME, calendarSchema, COLLECTION_NAME);
}


const getAllCalendars = async (req, res) => {
    try {
        const Calendar = getCalendarModel();
        const results = await Calendar.find().exec();

        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(results);
    } catch (err) {
        console.error('Error fetching routes:', err);
        res.status(500).json({ message: err.message });
    }
};


const getSingleCalendar = async (req, res) => {
    try {
        const Calendar = getCalendarModel();
        const route = await Calendar.findOne({ route_id: req.params.id }).exec();

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
    getAllCalendars,
    getSingleCalendar,
    getCalendarModel
};
