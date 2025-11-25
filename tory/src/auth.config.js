import dotenv from "dotenv";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import jwt from "jsonwebtoken";
import { prisma } from "./db.config.js";

dotenv.config();

const secret = process.env.JWT_SECRET; // .env 비밀 키

// 액세스 토큰 생성
export const generateAccessToken = (user) => {
  return jwt.sign(
    {
      user_id: user.user_id,
      social_provider: user.social_provider,
      social_id: user.social_id,
    },
    secret,
    { expiresIn: "1h" }
  );
};

// 리프레시 토큰 생성
export const generateRefreshToken = (user) => {
  return jwt.sign(
    {
      user_id: user.user_id,
    },
    secret,
    { expiresIn: "14d" }
  );
};

// Google 로그인 시 DB에서 사용자 찾거나 없으면 생성
const googleVerify = async (profile) => {
  const socialId = profile.id;
  if (!socialId) {
    throw new Error(
      `Google profile.id 가 없습니다: ${JSON.stringify(profile)}`
    );
  }

  const displayName = profile.displayName || "Google User";

  // 1) 기존 사용자 탐색
  let user = await prisma.users.findFirst({
    where: {
      social_provider: "google",
      social_id: socialId,
    },
  });

  if (user) {
    return user;
  }

  // 2) 없으면 새로 생성
  user = await prisma.users.create({
    data: {
      user_name: displayName,
      gender: "N", // enum Gender { M, F, N }
      birthdate: new Date(1970, 0, 1),
      address: "추후 수정",
      phone: "추후 수정",
      social_provider: "google",
      social_id: socialId,
      password: "GOOGLE_LOGIN", // 소셜 로그인용 더미 비밀번호
      point_balance: 0,
    },
  });

  return user;
};

// Google OAuth2 Strategy 설정
export const googleStrategy = new GoogleStrategy(
  {
    clientID: process.env.PASSPORT_GOOGLE_CLIENT_ID,
    clientSecret: process.env.PASSPORT_GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
  },
  async (accessToken, refreshToken, profile, cb) => {
    try {
      const user = await googleVerify(profile);

      const jwtAccessToken = generateAccessToken(user);
      const jwtRefreshToken = generateRefreshToken(user);

      return cb(null, {
        accessToken: jwtAccessToken,
        refreshToken: jwtRefreshToken,
      });
    } catch (err) {
      return cb(err);
    }
  }
);

// JWT Strategy 설정
const jwtOptions = {
  // Authorization: Bearer <token> 에서 토큰 추출
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

export const jwtStrategy = new JwtStrategy(
  jwtOptions,
  async (payload, done) => {
    try {
      const user = await prisma.users.findFirst({
        where: { user_id: payload.user_id },
      });

      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    } catch (err) {
      return done(err, false);
    }
  }
);