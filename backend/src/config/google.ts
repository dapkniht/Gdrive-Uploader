import passport from "passport";
import google from "passport-google-oauth20";
import { TokenPayload } from "../types/tokenPayload";
import "dotenv/config";

const GoogleStrategy = google.Strategy;

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      callbackURL: process.env.GOOGLE_CALLBACK_URL as string,
    },

    async (accessToken, refreshToken, profile, done) => {
      const user: TokenPayload = {
        googleId: profile.id,
        displayName: profile.displayName,
        picture: profile.photos![0].value,
        accessToken,
        refreshToken,
      };
      return done(null, user);
    }
  )
);
