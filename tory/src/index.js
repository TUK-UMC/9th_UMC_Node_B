import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import { handleUserSignUp } from "./controllers/user.controller.js";
import { handleAddStore } from "./controllers/store.controller.js";
import { handleAddReview } from "./controllers/review.controller.js";
import { handleAddMission } from "./controllers/mission.controller.js";
import { handleChallengeMission } from "./controllers/usermission.controller.js";

import { errorHandler } from "./middlewares/error.middleware.js";

import { reviewRouter } from "./routes/review.router.js";
import { missionRouter } from "./routes/mission.router.js";
import { userMissionRouter } from "./routes/usermission.router.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 8080;
const prefix = "/api/v1";

// 기본 미들웨어
app.use(cors());
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// 추가: morgan, cookie-parser
app.use(morgan("dev"));
app.use(cookieParser());

// 라우터
app.use(`${prefix}`, reviewRouter);
app.use(`${prefix}`, missionRouter);
app.use(`${prefix}`, userMissionRouter);

// Health & 기본 라우트
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Hello World!",
    data: null,
  });
});

// 단독 라우트(기존 유지)
app.post("/api/v1/users/signup", handleUserSignUp);

// 가게/리뷰/미션/유저미션 (create류 단독 라우트)
app.post(`${prefix}/stores`, handleAddStore);
app.post(`${prefix}/stores/:storeId/reviews`, handleAddReview);
app.post(`${prefix}/stores/:storeId/missions`, handleAddMission);
app.post(`${prefix}/stores/:storeId/missions/:missionId/challenge`, handleChallengeMission);

// 에러 미들웨어
app.use(errorHandler);

app.listen(port, () => {
  console.log(`${port} 포트에서 서버 운행 중`);
});