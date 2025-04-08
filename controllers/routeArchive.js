const mongodb = require('../data/database');
const { ObjectId } = require('mongodb'); // Add this for ObjectId

const routeArchiveSchema = {
    route_id: String,
    route_short_name: Number,
    route_long_name: String,
    route_type: Number
};

const DATABASE_NAME = "Transit";
const COLLECTION_NAME = "Route_Archive";

const getRouteArchiveModel = () => {
    const db = mongodb.getDatabase();
    return db.models[COLLECTION_NAME] || db.model(COLLECTION_NAME, routeArchiveSchema, COLLECTION_NAME);
}


const getAllRoutes = async (req, res) => {
    try {
        const Route = getRouteModel();
        const results = await Route.find().exec();

        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(results);
    } catch (err) {
        console.error('Error fetching routes:', err);
        res.status(500).json({ message: err.message });
    }
};


const getSingleRoute = async (req, res) => {
    try {
        const Route = getRouteModel();
        const route = await Route.findOne({ route_id: req.params.id }).exec();

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
    getAllRoutes,
    getSingleRoute,
    getRouteArchiveModel
};
