const dotenv = require('dotenv');
dotenv.config();

const mongoose = require('mongoose');

let _db;

const initDb = async () => {
    if (_db) {
        console.log('Database is already initialized!');
        return;
    }

    try {
        const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/Transit';

        await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        _db = mongoose.connection;

        // Add these debug logs
        console.log('Connected to database:', _db.name);
        console.log('Available collections:', await _db.db.listCollections().toArray());

        console.log('Database initialized');
    } catch (err) {
        console.error('Error initializing database:', err);
        throw err;
    }
};


const getDatabase = () => {
    if (!_db) {
        throw new Error('Database not initialized. Please call initDb first.');
    }
    return _db;
};

module.exports = {
    initDb,
    getDatabase
};
