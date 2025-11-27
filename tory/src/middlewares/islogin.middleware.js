import passport from "../config/passport.js";

export const isLogin = passport.authenticate("jwt", { session: false });