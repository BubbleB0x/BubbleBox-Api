var express = require('express');
var router = express.Router();
var dbConn = require('../lib/usersDb');
var auth = require('../lib/auth/auth');

var { check, header, validationResult, checkSchema } = require('express-validator');

/**
 * GET per ottenere l'attuale stato di salute dell'utente
 */
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

/**
 * POST per la sincronizzazione Utente ==> Device
 */
router.post('/sync', [
  // body device must be contain
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
      return res.status(200).json({ "access_token": token });
    }
  });
})

/**
 * POST per l'aggiunta di una nuova segnalazione
 */
router.post('/reporting', [
  // Body report must be contain
  check('report').exists().notEmpty(),
], (req, res, next) => {
  // Finds the validation errors in this request and wraps them in an object with handy functions
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  // recupero il report
  var report = req.body.report;
  //eseguo la query per l'inserimento del report
  dbConn.query('INSERT INTO symptomps (user, cough, soreThroath, runnyNose, breathDiff' +
    ', fatigue, diarrhea, temp, hypertension, heartDisease, diabetes, userNotes)' +
    ' VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [
    req.user.username,
    report.cough,
    report.soreThroath,
    report.runnyNose,
    report.breathDiff,
    report.fatigue,
    report.diarrhea,
    report.temp,
    report.hypertension,
    report.heartDisease,
    report.diabetes,
    report.userNotes,
  ], function (err, result) {
    if (err) {
      //mysql error
      if(err.sqlState == '45000') {
        return res.status(412).json({"message": err.sqlMessage});
      } else {
        return res.status(500).json({"message": "Internal server error"});;
      }
    } else {
      // Restituisco il risultato della query
      return res.status(200).json({"result": true});
    }
  });
})

module.exports = router;