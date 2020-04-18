var express = require('express');
var router = express.Router();
var auth = require('../lib/auth/auth');
var dbConn = require('../lib/usersDb');
var { check, header, validationResult } = require('express-validator');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'BubbleBox APIs' });
});

router.post('/login', [
  // Authorization header must be contain
  header('authorization').exists().isString().contains("Basic ").notEmpty(),
], (req, res, next) => {
  // Finds the validation errors in this request and wraps them in an object with handy functions
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  creds = Buffer.from(req.headers.authorization.split(' ')[1], 'base64').toString('ascii').split(':');
  username = creds[0];
  password = creds[1];

  dbConn.query('SELECT id, username, mail, name, surname, fc, birth, sex, role FROM users WHERE username = ? AND password = ? AND del = ?', [
    username,
    password,
    0
  ], function (err, result) {
    if (err) {
      //non autorizzato
      return res.status(500).send(err);
    } else {
      if (result[0] == undefined) {
        return res.status(401).json({ "error": "Wrong username or password" });
      } else {
        const token = auth.generateAccessToken({ user: result[0] });
        return res.status(200).json({ "access_token": token });
      }
    }
  });
})

router.post('/loginDevice', [
  // Authorization header must be contain
  header('authorization').exists().isString().contains("Basic ").notEmpty(),
], (req, res, next) => {
  console.log(req.headers);
  // Finds the validation errors in this request and wraps them in an object with handy functions
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  creds = Buffer.from(req.headers.authorization.split(' ')[1], 'base64').toString('ascii').split(':::');
  mac = creds[0];
  console.log(mac)
  password = creds[1];

  dbConn.query('SELECT id, mac FROM devices WHERE mac = ? AND password = ? AND del = ?', [
    mac,
    password,
    0
  ], function (err, result) {
    if (err) {
      //non autorizzato
      return res.status(500).send(err);
    } else {
      if (result[0] == undefined) {
        return res.status(401).json({ "error": "Wrong mac or password" });
      } else {
        result[0].role = "device";
        const token = auth.generateAccessToken({ user: result[0] });
        return res.status(200).json({ "access_token": token });
      }
    }
  });
})

router.post('/reg', (req, res) =>{

//console.log(req.body);
var username_ = req.body.username;
var password_=req.body.password;
var email_ = req.body.email;
var name_=req.body.name;
var surname_ = req.body.surname;
var gender_=req.body.gender;
var date_ = req.body.date;
var fiscal_code_=req.body.fiscal_code;






let params=[[username_,password_,email_,name_,surname_,"H",fiscal_code_,date_,gender_,0,"user",0]];
let query='INSERT INTO users (username, password, mail,name,surname,hs,fc,birth,sex,del,role,verify) VALUES ?;';
//console.log("params: ",params,"query: ",query);


dbConn.query(query,[params],
  function (err, result) {
    if (err) {
     
      return res.status(500).send(err);
    } else {
      console.log(result);
      res.status(200).send(result);
    }
  });

  
  
})


router.post('/reporting', (req, res) =>{
console.log(req.body);






})
module.exports = router;
