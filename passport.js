'use strict';

require('./mongoose')();
var passport = require('passport');
var User = require('mongoose').model('User');
var GoogleTokenStrategy = require('passport-google-token').Strategy;
// var config = require('./config');
require("dotenv").config();

module.exports = function () {

    passport.use(new GoogleTokenStrategy({
            clientID: process.env.REACT_APP_rci,
            clientSecret: process.env.googleClientSecret
        },
        function (accessToken, refreshToken, profile, done) {
            User.upsertGoogleUser(accessToken, refreshToken, profile, function(err, user) {
                // console.log(accessToken,profile,user);
                return done(err, user);
            });
        }));
};
