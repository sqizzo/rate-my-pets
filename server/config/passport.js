const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENTID,
      clientSecret: process.env.GOOGLE_CLIENTSECRET,
      callbackURL: "http://localhost:3005/api/auth/google/callback", //endpoint redirect kemana ketika selesai login
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const existingUser = await User.findOne({ googleId: profile.id });

        if (existingUser) {
          return done(null, existingUser);
        }

        const newUser = await User.create({
          username: profile.displayName,
          email: profile.emails[0].value,
          googleId: profile.id,
          role: "user",
          isEmailVerified: true,
        });

        return done(null, newUser);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);
