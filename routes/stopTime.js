const express = require('express');
const router = express.Router();
const stopTimeController = require('../controllers/stopTime');

router.get('/', stopTimeController.getAllStopTimes);
router.get('/:id', stopTimeController.getSingleStopTime);

module.exports = router;
