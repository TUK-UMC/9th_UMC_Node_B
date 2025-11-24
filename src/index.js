import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import passport from "passport";

import { googleStrategy, jwtStrategy } from "./auth.config.js";
import { handleUserSignUp } from "./controllers/user.controller.js";
import { handleAddStore } from "./controllers/store.controller.js";
import { handleAddMission, handleListStoreMissions } from "./controllers/mission.controller.js";
import { handleChallengeMission, handleListUserOngoingMissions, handleCompleteUserMissions } from "./controllers/usermission.controller.js";
import { handleAddReview, handleListStoreReviews, handleListUserReviews } from "./controllers/review.controller.js";

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

// Passport 전략 등록
passport.use(googleStrategy);
passport.use(jwtStrategy);
app.use(passport.initialize());

// JWT 로그인 미들웨어
const isLogin = passport.authenticate('jwt', { session: false });

// 공통 응답 헬퍼
app.use((req, res, next) => {
  res.success = (data) => res.json({ resultType: "SUCCESS", error: null, success: data });
  res.error = ({ statusCode = 500, errorCode = "unknown", reason = null, data = null }) =>
    res.status(statusCode).json({ resultType: "FAIL", error: { errorCode, reason, data }, success: null });
  next();
});

// 기본 미들웨어
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(morgan('dev'));

// 테스트 라우트
app.get('/test', (req, res) => res.send("Hello"));
app.get('/setcookie', (req, res) => {
    res.cookie('myCookie', 'hello', { maxAge: 60000 });
    res.send('쿠키가 생성되었습니다!');
});
app.get('/getcookie', (req, res) => {
    const myCookie = req.cookies.myCookie;
    res.send(myCookie ? `당신의 쿠키: ${myCookie}` : '쿠키가 없습니다.');
});

// Google OAuth
app.get("/oauth2/login/google", passport.authenticate("google", { session: false }));
app.get(
  "/oauth2/callback/google",
  passport.authenticate("google", { session: false, failureRedirect: "/login-failed" }),
  (req, res) => {
    const tokens = req.user;
    res.success({ message: "Google 로그인 성공!", tokens });
  }
);

// 로그인 필수 API 예시
app.get('/mypage', isLogin, (req, res) => {
  res.success({ message: `인증 성공! ${req.user.name}님의 마이페이지입니다.`, user: req.user });
});

// 기존 API 라우트 (로그인 필수 적용 가능)
app.post("/api/v1/users/signup", handleUserSignUp); // 회원가입
app.post("/api/v1/stores", isLogin, handleAddStore); // 가게 등록
app.post("/api/v1/stores/:storeId/reviews", isLogin, handleAddReview); // 리뷰 작성
app.post("/api/v1/stores/:storeId/missions", isLogin, handleAddMission); // 미션 등록
app.post("/api/v1/stores/:storeId/missions/:missionId/challenge", isLogin, handleChallengeMission); // 미션 도전

app.get("/api/v1/stores/:storeId/reviews", handleListStoreReviews);
app.get("/api/v1/users/:userId/reviews", handleListUserReviews);
app.get("/api/v1/stores/:storeId/missions", handleListStoreMissions);
app.get("/api/v1/users/:userId/missions/ongoing", handleListUserOngoingMissions);
app.patch("/api/v1/users/:userId/missions/:userMissionId/complete", handleCompleteUserMissions);

// 전역 오류 처리
app.use((err, req, res, next) => {
  if (res.headersSent) return next(err);
  res.error({ statusCode: err.statusCode || 500, errorCode: err.errorCode || "unknown", reason: err.message || null, data: err.data || null });
});

// 서버 실행
app.listen(port, () => console.log(`Server running on port ${port}`));
cd