import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import cookieParser  from "cookie-parser";

import YAML from "yamljs";
import swaggerUi from "swagger-ui-express";

import passport from "./config/passport.js";
import authRoutes from "./routes/auth.router.js";

import { handleAddStore } from "./controllers/store.controller.js";
import { handleAddReview } from "./controllers/review.controller.js";
import { handleAddMission } from "./controllers/mission.controller.js";
import { handleChallengeMission } from "./controllers/usermission.controller.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import { reviewRouter } from "./routes/review.router.js";
import { missionRouter } from "./routes/mission.router.js";
import { userMissionRouter } from "./routes/usermission.router.js";
import { userRouter } from "./routes/user.router.js";
import { storeRouter } from "./routes/store.router.js";

import { isLogin } from "./middlewares/islogin.middleware.js";

dotenv.config();

const app = express();
const port = process.env.PORT;
const prefix = "/api/v1";

/* Swagger (YAML) */
const swaggerDocument = YAML.load("./src/swagger/openapi.yaml");
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

/* 미들웨어 */
app.use(cors()); // cors 방식 허용
app.use(express.static("public")); // 정적 파일 접근
app.use(express.json()); // request의 본문을 json으로 해석할 수 있도록 함 (JSON 형태의 요청 body를 파싱하기 위함)
app.use(express.urlencoded({ extended: false })); // 단순 객체 문자열 형태로 본문 데이터 해석
app.use(morgan("dev")); //로그 포맷: dev
app.use(cookieParser());

/* PassPort */
app.use(passport.initialize());
app.use(authRoutes);


/* 라우터 관련 */
app.use(`${prefix}`, userRouter);
app.use(`${prefix}`, storeRouter);
app.use(`${prefix}`, reviewRouter);
app.use(`${prefix}`, missionRouter);
app.use(`${prefix}`, userMissionRouter);


/* 에러 관련 */
app.use(errorHandler);

/* 서버 시작 */
app.listen(port, () => {
  console.log(`${port}포트에서 서버 운행 중`);
});

/* 회원가입,로그인 관련 */
// 보호된 테스트 라우트
app.get("/mypage", isLogin, (req, res) => {
  res.status(200).json({
    message: `인증 성공! ${req.user.name}님의 마이페이지`,
    user: req.user,
  });
});