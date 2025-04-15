const mongodb = require('../data/database');
const { ObjectId } = require('mongodb'); // Add this for ObjectId

const subscriptionSchema = {
    email: String,
    route_id: Number,
    stop_id: Number,
    times: {
        type: [
            {
                weekdays: {
                    type: [Number],
                    required: true
                },
                startTime: {
                    type: Date,
                    required: true
                },
                endTime: {
                    type: Date,
                    required: true
                }
            }
        ],
        default: []
    }
};

const DATABASE_NAME = "Transit";
const COLLECTION_NAME = "Subscription";

const getSubscriptionModel = () => {
    const db = mongodb.getDatabase();
    return db.models[COLLECTION_NAME] || db.model(COLLECTION_NAME, subscriptionSchema, COLLECTION_NAME);
}


const getAllSubscriptions = async (req, res) => {
    try {
        const Subscription = getSubscriptionModel();
        const results = await Subscription.find().exec();

        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(results);
    } catch (err) {
        console.error('Error fetching routes:', err);
        res.status(500).json({ message: err.message });
    }
};


const createSubscription = async (req, res) => {
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
