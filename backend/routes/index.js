var express = require('express');
var router = express.Router();
const soleController = require('../controllers/index')

/* GET home page. */
router.get('/', soleController.index);

/* POST contact form details */
router.post('/contact', soleController.sendMessage);

module.exports = router;
