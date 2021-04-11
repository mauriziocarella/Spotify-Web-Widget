const express = require('express');
const router = express.Router();
const path = require('path');

router.use('/api', require('./api'));

router.use(express.static(path.join(__dirname, '..', 'build')));
router.get('*', function (req, res, next) {
	res.sendFile(path.join(__dirname, '..', 'build', 'index.html'));
});

module.exports = router;
