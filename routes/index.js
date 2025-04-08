const router = require('express').Router();

router.use('/route', require('./route'));
router.use('/stop', require('./stop'));
router.use('/stoptime', require('./stopTime'));
router.use('/auth', require('./auth'));
router.use('/routearchive', require('./routeArchive'));
// router.use('/routeArchive', require('./routeArchive'));
// router.use('/trip', require('./trip'));

module.exports = router;