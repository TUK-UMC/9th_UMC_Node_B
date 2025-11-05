/*
1. 공통 라우터는 
const prefix = "/api/v1";
app.use(${prefix}/user, userRouter);
이렇게 리터럴 문자로 사용하여 처리하는 것도 방법이다.
2. 마지막 부분에 에러 핸들러 작성해주시면 더 좋을 것 같다.
*/

import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { handleUserSignUp } from "./controllers/user.controller.js";
import { handleAddStore } from "./controllers/store.controller.js";
import { handleAddReview } from "./controllers/review.controller.js";
import { handleAddMission } from "./controllers/mission.controller.js";
import { handleChallengeMission } from "./controllers/usermission.controller.js";
import { errorHandler } from "./middlewares/error.middleware.js";
dotenv.config();

const app = express();
const port = process.env.PORT;
const prefix = "/api/v1";

app.use(cors()); // cors 방식 허용
app.use(express.static("public")); // 정적 파일 접근
app.use(express.json()); // request의 본문을 json으로 해석할 수 있도록 함 (JSON 형태의 요청 body를 파싱하기 위함)
app.use(express.urlencoded({ extended: false })); // 단순 객체 문자열 형태로 본문 데이터 해석


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