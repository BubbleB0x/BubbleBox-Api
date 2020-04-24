var express = require('express');
var { check, header, validationResult, checkSchema } = require('express-validator');
var router = express.Router();
var dbConn = require('../lib/usersDb');

/**
 * POST per inserire un nuovo blast fra 2 utenti
 */
router.post('/blast', [
    // Authorization header must be contain
    check('blast').exists().notEmpty().isArray(),
], (req, res, next) => {
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    blasts = new Array();
    blastsIndex = 0;
    req.body.blast.forEach(blast => {
        creds = Buffer.from(blast, 'base64').toString('ascii').split('|');
        console.log("___CREDS____")
        console.log(creds[3])
        console.log("___CREDS____")
        creds[3] = creds[3].replace("\r\n", "");
        blasts[blastsIndex] = new Array(3);
        blasts[blastsIndex][0] = creds[2];
        blasts[blastsIndex][1] = creds[3];
        blasts[blastsIndex][2] = creds[0].replace(/_/g, '-') + ' ' + creds[1]
        console.log(blasts)
        blastsIndex++;
    });
    console.log(blasts)
    dbConn.query('INSERT INTO blasts (my_device, enc_device, timestamp) VALUES ?', [
        blasts
    ], function (err, result) {
        if (err) {
            //errore query
            console.log(err)
            return res.status(500).send(err);
        } else {
            return res.status(200).json({ "result": true })
        }
    });
})

module.exports = router;
