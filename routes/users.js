var express = require('express');
var router = express.Router();
var dbConn = require('../lib/usersDb');
var auth = require('../lib/auth/auth');

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

router.get('/id', function (req, res, next) {
 
  dbConn.query("SELECT id FROM users WHERE id = ?", [
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

router.get('/symp', function (req, res, next) {
 
  dbConn.query("SELECT symp FROM symptomps WHERE idUser = ?", [
    req.user.id
  ], function (err, result) {
    if (err) {
      //Server error
      return res.status(500).send(err);
    } else {
      console.log('ok')
      console.log(req.user.id);
      console.log(result);    
     console.log(result.length);
     if(result.length==0){
       console.log("non ci sono report");
      return res.status(200).send(false);}
      else return res.status(200).send(true);
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
    return res.status(422).json({ errors: errors.array() });
  }
  mac = Buffer.from(req.body.device, 'base64').toString('ascii');
  dbConn.query('UPDATE users SET device = ? WHERE id = ?', [
    mac,
    req.user.id
  ], function (err, result) {
    if (err) {
      //mysql error
      return res.status(500).send(err);
    } else {
      req.user.device = mac;
      const token = auth.generateAccessToken({ user: req.user });
      return res.status(200).json({"access_token": token });
    }
  });
})

module.exports = router;