var jwt = require('jsonwebtoken');
require("dotenv").config();

var createToken = function(auth) {
    return jwt.sign({
            id: auth._id,
            user: auth.email
        }, process.env.jwtToken,
        {
            expiresIn: 60 * 120
        });
};

module.exports = {
  generateToken: function(req, res, next) {
    //   console.log(req.user);
      req.token = createToken(req.user);
      return next();
  },
  sendToken: function(req, res) {
      res.setHeader('x-auth-token', req.token);
      return res.status(200).send(JSON.stringify(req.user));
  }
};