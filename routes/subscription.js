const express = require('express');
const router = express.Router();
const subscriptionController = require('../controllers/subscription');

router.get('/', subscriptionController.getAllSubscriptions);
router.post('/:id', subscriptionController.createSubscription);

module.exports = router;
