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

router.post('/sync', [
  // Authorization header must be contain
  check('device').exists().isString().notEmpty(),
], (req, res, next) => {
  // Finds the validation errors in this request and wraps them in an object with handy functions
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ error: errors.array(), reason: "empty but present field" });
  }
  if (!errors.exists()) {
    return res.status(422).json({ error: errors.array(), reason: "field does not exist" });
  }
  if (!errors.isString()) {
    return res.status(422).json({ error: errors.array(), reason: "" });
  }
  mac = Buffer.from(req.body.device, 'base64').toString('ascii');
  dbConn.query('INSERT INTO users (mac) VALUES ? WHERE id = ?', [
    mac,
    req.user.id
  ], function (err, result) {
    if (err) {
      //mysql error
      return res.status(500).send(err);
    } else {
      user = req.user
      console.log(user)
      console.log(result)
      //const token = auth.generateAccessToken({ user: result[0] });
      return //res.status(200).json({ "access_token": token });
    }
  });
})

module.exports = router;