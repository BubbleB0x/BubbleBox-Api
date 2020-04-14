var express = require('express');
var router = express.Router();
var dbConn = require('../lib/usersDb');
var { check, header, validationResult, checkSchema } = require('express-validator');

router.get('/hs', function (req, res, next) {
  dbConn.query("SELECT hs FROM users WHERE id = ?", [
    req.user.id
  ], function (err, result) {
    if (err) {
      //Server error
      return res.status(500).send(err);
    } else {
      console.log('ok')
      // return hs
      return res.status(200).send(result[0]);
    }
  });
});

module.exports = router;