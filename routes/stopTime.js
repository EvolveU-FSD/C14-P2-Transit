const express = require('express');
const router = express.Router();
const stopTimeController = require('../controllers/stopTime');

router.get('/', stopTimeController.getAllStopTimes);
router.get('/:id', stopTimeController.getSingleStopTime);
router.get('/trip/:id', stopTimeController.getStopTimesByTripId);
router.get('/stop/:id', stopTimeController.getStopTimesByStopId);

module.exports = router;
