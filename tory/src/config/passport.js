import passport from "passport";
import { googleStrategy } from "../config/auth.config.js";
import { jwtStrategy } from "../config/jwt.config.js";

passport.use(googleStrategy);
passport.use(jwtStrategy);

export default passport;