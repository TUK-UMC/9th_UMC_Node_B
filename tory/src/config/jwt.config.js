import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import dotenv from "dotenv";
import { prisma } from "../config/db.config.js";

dotenv.config();

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

export const jwtStrategy = new JwtStrategy(jwtOptions, async (payload, done) => {
  try {
    const user = await prisma.users.findFirst({ 
      where: { 
        user_id: payload.id 
      } 
    });
    if (!user) return done(null, false);
    return done(null, user);
  } catch (err) {
    done(err, false);
  }
});