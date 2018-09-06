var express = require('express');
var router = express.Router();

/* GET etbs-users listing. */
router.get('/', function(req, res, next) {
  res.render('v1/extdetails');
});

module.exports = router;
