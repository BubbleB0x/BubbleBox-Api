var express = require('express');
var router = express.Router();
var auth = require('../lib/auth/auth');
var dbConn = require('../lib/usersDb');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'BubbleBox APIs' });
});

router.post('/login', (req, res, next) => {
  creds = Buffer.from(req.headers.authorization.split(' ')[1], 'base64').toString('ascii').split(':');
  username = creds[0];
  password = creds[1];

  dbConn.query('SELECT * FROM users WHERE username = ? AND password = ? AND del = ?', [
    username,
    password,
    0
  ], function (err, result) {
    if (err) {
      //non autorizzato
      return res.status(500).send(err);
    } else {
      if (result[0] == undefined) {
        return res.status(401).json({ "error": "Username o password errati" });
      } else {
        // render to views/books/index.ejs
        const token = auth.generateAccessToken({ user: result[0] });
        return res.status(200).json({ "access_token": token });
      }
    }
  });
})

module.exports = router;
