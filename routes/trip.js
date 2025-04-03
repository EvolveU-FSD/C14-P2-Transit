const express = require('express');
const router = express.Router();
const tripController = require('../controllers/trip');

router.get('/', tripController.getAllTrips);
router.get('/:id', tripController.getSingleTrip);

module.exports = router;