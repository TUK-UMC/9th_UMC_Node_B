import dotenv from "dotenv";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { prisma } from "./db.config.js";
import jwt from "jsonwebtoken";

dotenv.config();
const secret = process.env.JWT_SECRET;

export const generateAccessToken = (user) =>
  jwt.sign({ id: user.id, email: user.email }, secret, { expiresIn: "1h" });

export const generateRefreshToken = (user) =>
  jwt.sign({ id: user.id }, secret, { expiresIn: "14d" });

// Google Verify
const googleVerify = async (profile) => {
  const email = profile.emails?.[0]?.value;
  if (!email) throw new Error(`profile.email was not found`);

  let user = await prisma.user.findUnique({ where: { email } });
  if (user) return user;

  user = await prisma.user.create({
    data: {
      email,
      name: profile.displayName,
      gender: "추후 수정",
      birth: new Date(1970, 0, 1),
      address: "추후 수정",
      detailAddress: "추후 수정",
      phoneNumber: "추후 수정",
    },
  });
  return user;
};

// Google Strategy
export const googleStrategy = new GoogleStrategy(
  {
    clientID: process.env.PASSPORT_GOOGLE_CLIENT_ID,
    clientSecret: process.env.PASSPORT_GOOGLE_CLIENT_SECRET,
    callbackURL: "/oauth2/callback/google",
    scope: ["email", "profile"],
  },
  async (accessToken, refreshToken, profile, cb) => {
    try {
      const user = await googleVerify(profile);
      const jwtAccessToken = generateAccessToken(user);
      const jwtRefreshToken = generateRefreshToken(user);

      return cb(null, { accessToken: jwtAccessToken, refreshToken: jwtRefreshToken });
    } catch (err) {
      return cb(err);
    }
  }
);

// JWT Strategy
export const jwtStrategy = new JwtStrategy(
  {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: secret,
  },
  async (payload, done) => {
    try {
      const user = await prisma.user.findUnique({ where: { id: payload.id } });
      if (!user) return done(null, false);
      return done(null, user);
    } catch (err) {
      return done(err, false);
    }
  }
);
