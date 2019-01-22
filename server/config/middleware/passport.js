const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const Client = require('../../models/client');
const config = require('../config');

module.exports = function (passport) {
    console.log("HIT PASSPORT:");
    let opts = {};
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
    opts.secretOrKey = config.jwt_secret;
    console.log("PASSPORT OPTIONS");
    passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
        console.log("PAYLOAD",jwt_payload);
        Client.getClientById(jwt_payload.client._id, (err, client) => {
            if (err) {
                console.log("PASSPORT ERROR", err)
                return done(err, false);
            }
            if (client) {
                console.log("FOUND CLIENT WITH PASSPORT:", client)
                return done(null, client);
            } else {
                console.log("PASSPORT VERIFIED BUT NULL FALSE:", client)
                return done(null, false);
            }
        });
    }));
}