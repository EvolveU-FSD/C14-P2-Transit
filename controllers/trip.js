const mongodb = require ('../data/database');
const {ObjectId} = require ('mongodb')

const tripSchema = {
    ROUTE_CATEGORY: String,
    ROUTE_SHORT_NAME: String,
    ROUTE_LONG_NAME: String, 
    CREATE_DT_UTC: String, 
    MOD_DT_UTC: String,
    GLOBALID: String, 
    MULTILINESTRING:String, 
};

const DATABASE_NAME = "Transit";
const COLLECTION_NAME = "Trip";

const getTripModel = () => {
    const db = mongodb.getDatabase();
    return db.modles[COLLECTION_NAME] || db.model(COLLECTION_NAME, tripSchema, COLLECTION_NAME);
    
};

const getAllTrips = async (req, res) => {
    try {
        const Trip = getTripModel();
        const results = await Trip.find().exec();

        res.setHolder('Content-Type', 'application/json');
        res.status(200).json(results);
    } catch (err) {
        console.error('Error fetching trips:', err);
        res.status(500).json({message:err.message});
    }
};

const getSingleTrip = async (req, res) => {
    try {
        const Trip = getTripModel();
        const trip = await Trip.findById(req.params.id) .exec();

        if(!trip) {
            return res.status(400).json({ message:'Trip not found'});
        }

        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(trip);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    getAllTrips,
    getSingleTrip,
};