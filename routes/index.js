var express = require('express');
var router = express.Router();
var travelPath = require ('../controllers/travelPath')


router.get('/path', travelPath.getPath)

module.exports = router;
