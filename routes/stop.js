const express = require('express');
const router = express.Router();
const stopController = require('../controllers/stop');

router.get('/', stopController.getAllStops);
router.get('/:id', stopController.getSingleStop);

module.exports = router;