const express = require('express');
const router = express.Router();
const routeController = require('../controllers/route');

router.get('/', routeController.getAllRoutes);
router.get('/:id', routeController.getSingleRoute);

module.exports = router;
