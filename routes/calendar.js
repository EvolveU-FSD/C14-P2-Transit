const express = require('express');
const router = express.Router();
const calendarController = require('../controllers/calendar');

router.get('/', calendarController.getAllCalendars);
router.get('/:id', calendarController.getSingleCalendar);

module.exports = router;
