var jwt = require("jsonwebtoken");

module.exports = {
  authenticateToken: function (req, res, next) {
    // Gather the jwt access token from the request header
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.sendStatus(401) // if there isn't any token

    jwt.verify(token, process.env.TOKEN_SECRET, (err, decode) => {
      console.log(err)
      if (err) return res.sendStatus(403)
      req.user = decode.user
      next() // pass the execution off to whatever request the client intended
    })
  },

  generateAccessToken: function (payload) {
    // expires after half and hour (1800 seconds = 30 minutes)
    // return jwt.sign(payload, process.env.TOKEN_SECRET, { expiresIn: '1800s' });

    // Immortal Token (?)
    return jwt.sign(payload, process.env.TOKEN_SECRET);
  },

  rbacUsers: function (req, res, next) {
    switch (req.user.role) {
      case 'user': next(); break;
      case 'staff': next(); break;
      case 'admin': next(); break;
      default: return res.status(403).json({ "error_message": "access denied" });
    }
  },

  rbacDevices: function (req, res, next) {
    console.log(req.user)
    switch (req.user.role) {
      case 'device': next(); break;
      //case 'admin': break;
      default: return res.status(403).json({ "error_message": "access denied" });
    }
  },

  rbacStaff: function (req, res, next) {
    switch (req.user.role) {
      case 'staff': next(); break;
      case 'admin': next(); break;
      default: return res.status(403).json({ "error_message": "access denied" });
    }
  },

  rbacAdmin: function (req, res, next) {
    switch (req.user.role) {
      case 'admin': next(); break;
      default: return res.status(403).json({ "error_message": "access denied" });
    }
  },
}