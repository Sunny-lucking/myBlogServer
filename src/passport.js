const JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;

const mongoose = require("mongoose");
const Admin = mongoose.model("Admin");
// const keys = require("../config/keys");

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = "secret";

module.exports = passport => {
    passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
        Admin.findOne(jwt_payload.name)
            .then(admin => {
                if (admin) {
                    return done(null, admin);
                }
                return done(null, false)
            })
            .catch(err => {
                console.log(err);
            })
    }));
}
