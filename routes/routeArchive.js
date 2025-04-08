const express = require('express');
const router = express.Router();
const routeArchiveController = require('../controllers/routeArchive');

router.get('/', routeArchiveController.getAllRoutes);
router.get('/:id', routeArchiveController.getSingleRoute);

module.exports = router;
