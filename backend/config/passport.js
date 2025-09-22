import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import Author from '../models/Author.js';

// Google OAuth Strategy
const configureGoogleStrategy = () => {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    console.error('Google OAuth credentials missing');
    return false;
  }

  try {
    passport.use('google', new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:3000/auth/google/callback"
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // check user already exists with Google ID
          let user = await Author.findOne({ googleId: profile.id });

          if (user) {
            return done(null, user);
          }

          // Check user exists with same email
          user = await Author.findOne({ email: profile.emails[0].value });

          if (user) {
            // Link Google account to existing user
            user.googleId = profile.id;
            user.isOAuthUser = true;
            await user.save();
            return done(null, user);
          }

          // Create new user
          user = new Author({
            nome: profile.name.givenName,
            cognome: profile.name.familyName,
            email: profile.emails[0].value,
            googleId: profile.id,
            password: 'google-oauth-' + profile.id, 

            avatar: profile.photos ? profile.photos[0].value : undefined,
            isOAuthUser: true
          });

          await user.save();
          return done(null, user);
        } catch (error) {
          done(error, null); 
        }
      }
    ));
    return true;
  } catch (error) {
    console.error('Google strategy configuration failed:', error);
    return false;
  }
};


passport.serializeUser((user, done) => {
  done(null, user._id);
});


passport.deserializeUser(async (id, done) => {
  try {
    const user = await Author.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport;
export { configureGoogleStrategy };
