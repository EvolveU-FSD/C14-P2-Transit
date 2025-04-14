const express = require('express');
const router = express.Router();
const calendarDateController = require('../controllers/calendarDate');

router.get('/', calendarDateController.getAllCalendarDates);
router.get('/:id', calendarDateController.getSingleCalendarDate);

module.exports = router;
