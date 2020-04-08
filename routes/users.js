var express = require('express');
var router = express.Router();
var dbConn = require('../lib/usersDb');

/* GET users listing. */
router.get('/prova', function (req, res, next) {
  return res.send('ok');
});

module.exports = router;
