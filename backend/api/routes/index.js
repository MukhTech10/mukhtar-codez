var express = require('express');
var router = express.Router();
const indexController = require('../controllers/index')

router.post('/contact', indexController.sendMessage);

module.exports = router