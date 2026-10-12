var express = require('express');
var router = express.Router();
const indexController = require('../controllers/index')

router.post('/contact', indexController.sendMessage);

// Handle Invalid End Points
router.get('/*', notFound);
router.post('/*', notFound);
router.put('/*', notFound);
router.delete('/*', notFound);

function notFound(req, res, next) {
    res.status(400);
    res.send('Not A Valid End Point')
}

module.exports = router