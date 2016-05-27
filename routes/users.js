var express = require('express');
var router = express.Router();

/* GET users listing. */
/* this file is not used... */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
