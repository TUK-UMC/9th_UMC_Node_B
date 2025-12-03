import dotenv from "dotenv";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { prisma } from "../config/db.config.js";
import jwt from "jsonwebtoken"; // JWT 생성을 위해 import 

dotenv.config();
const secret = process.env.JWT_SECRET; // .env의 비밀 키 

export const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user.user_id, provider: user.social_provider, socialId: user.social_id },
    secret,
    { expiresIn: "1h" }
  );
};

export const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user.user_id },
    secret,
    { expiresIn: "14d" }
  );
};

// Google 사용자 DB 처리
const googleVerify = async (profile) => {
  const socialId = profile.id;
  const name = profile.displayName;

  //등록된 사용자가 있는지 체크
  let user = await prisma.users.findFirst({
    where: {
      social_provider: "google",
      social_id: socialId,
    },
  });

  //없으면 회원 가입
  if (!user) {
    user = await prisma.users.create({
      data: {
        user_name: name,
        gender: "N",
        birthdate: null,
        address: "",
        phone: "",
        social_provider: "google",
        social_id: socialId,
        password: "", // 소셜 로그인은 비밀번호 없음
      },
    });
    return {user, isNewUser: true };
  }

  return {user, isNewUser: false };
};

// GoogleStrategy 
export const googleStrategy = new GoogleStrategy(
  {
    clientID: process.env.PASSPORT_GOOGLE_CLIENT_ID,
    clientSecret: process.env.PASSPORT_GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL, 
    scope: ["email", "profile"],
  },

  
  async (accessToken, refreshToken, profile, cb) => {
    try {
     
      const {user, isNewUser } = await googleVerify(profile);
      
      const jwtAccessToken = generateAccessToken(user);
      const jwtRefreshToken = generateRefreshToken(user);

      return cb(null, {
        user,
        accessToken: jwtAccessToken,
        refreshToken: jwtRefreshToken,
        isNewUser
      });

    } catch (err) {
      return cb(err);
    }
  }
);