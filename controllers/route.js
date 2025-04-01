const mongodb = require('../data/database');
const { ObjectId } = require('mongodb'); // Add this for ObjectId

const routeSchema = {
    ROUTE_CATEGORY: String,
    ROUTE_SHORT_NAME: String,
    ROUTE_LONG_NAME: String,
    CREATE_DT_UTC: String,
    MOD_DT_UTC: String,
    GLOBALID: String,
    MULTILINESTRING: String
};

const DATABASE_NAME = "Transit";
const COLLECTION_NAME = "Route";

const getRouteModel = () => {
    const db = mongodb.getDatabase();
    return db.models[COLLECTION_NAME] || db.model(COLLECTION_NAME, routeSchema, COLLECTION_NAME);
};

const getAllRoutes = async (req, res) => {
    try {
        const Route = getRouteModel();

        // Debug information
        console.log('Collection name:', Route.collection.name);
        console.log('Collection namespace:', Route.collection.namespace);

        // Count documents in collection
        const count = await Route.collection.countDocuments();
        console.log('Number of documents in collection:', count);

        // Get a sample document
        const sampleDoc = await Route.collection.findOne();
        console.log('Sample document:', sampleDoc);

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
        const route = await Route.findById(req.params.id).exec();

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
};
