const router = require('express').Router();

router.use('/route', require('./route'));
// router.use('/stop', require('./stop'));
// router.use('/stop_time', require('./stopTime'));
// router.use('/trip', require('./trip'));

module.exports = router;