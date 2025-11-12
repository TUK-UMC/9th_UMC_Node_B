import cors from "cors";
import dotenv from "dotenv";
import express from "express";
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
const port = process.env.PORT;
const prefix = "/api/v1";
app.use(cors()); // cors 방식 허용
app.use(express.static("public")); // 정적 파일 접근
app.use(express.json()); // request의 본문을 json으로 해석할 수 있도록 함 (JSON 형태의 요청 body를 파싱하기 위함)
app.use(express.urlencoded({ extended: false })); // 단순 객체 문자열 형태로 본문 데이터 해석

//라우터 관련
app.use(`${prefix}`, reviewRouter);
app.use(`${prefix}`, missionRouter);
app.use(`${prefix}`, userMissionRouter);


app.get("/", (req, res) => {
  res.send("Hello World!");
});
//유저 관련
app.post("/api/v1/users/signup", handleUserSignUp);
//가게 관련
app.post(`${prefix}/stores`, handleAddStore);
app.post(`${prefix}/stores/:storeId/reviews`, handleAddReview);
app.post(`${prefix}/stores/:storeId/missions`, handleAddMission);
app.post(`${prefix}/stores/:storeId/missions/:missionId/challenge`,handleChallengeMission);
//에러 관련
app.use(errorHandler);


app.listen(port, () => {
  console.log(`${port}포트에서 서버 운행 중`);
});