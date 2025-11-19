import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import { handleUserSignUp } from "./controllers/user.controller.js";
import { handleAddStore } from "./controllers/store.controller.js";
import { handleAddMission, handleListStoreMissions } from "./controllers/mission.controller.js";  // ← handleListStoreMissions 추가
import { handleChallengeMission, handleListUserOngoingMissions, handleCompleteUserMissions } from "./controllers/usermission.controller.js";  // ← 2개 추가
import { handleAddReview, handleListStoreReviews, handleListUserReviews } from "./controllers/review.controller.js";
import swaggerAutogen from "swagger-autogen";
import swaggerUiExpress from "swagger-ui-express";

dotenv.config();

const app = express();
const port = process.env.PORT;

// 공통 응답 헬퍼 함수 추가
app.use((req, res, next) => {
  res.success = (success) => {
    return res.json({ resultType: "SUCCESS", error: null, success });
  };
  res.error = ({ errorCode = "unknown", reason = null, data = null }) => {
    return res.json({
      resultType: "FAIL",
      error: { errorCode, reason, data },
      success: null,
    });
  };
  next();
});

app.use(
  "/docs",
  swaggerUiExpress.serve,
  swaggerUiExpress.setup({}, {
    swaggerOptions: {
      url: "/openapi.json",
    },
  })
);

app.use(cors());
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev'));
app.use(cookieParser()); 

app.get('/test', (req, res) => {
  res.send("Hello");
});

app.get('/setcookie', (req, res) => {
    res.cookie('myCookie', 'hello', { maxAge: 60000 });
    res.send('쿠키가 생성되었습니다!');
});

app.get('/getcookie', (req, res) => {
    const myCookie = req.cookies.myCookie; 
    
    if (myCookie) {
        console.log(req.cookies);
        res.send(`당신의 쿠키: ${myCookie}`);
    } else {
        res.send('쿠키가 없습니다.');
    }
});

app.get("/openapi.json", async (req, res, next) => {
  // #swagger.ignore = true
  const options = {
    openapi: "3.0.0",
    disableLogs: true,
    writeOutputFile: false,
  };
  const outputFile = "/dev/null"; // 파일 출력은 사용하지 않습니다.
  const routes = ["./src/index.js"];
  const doc = {
    info: {
      title: "UMC 9th",
      description: "UMC 9th Node.js 테스트 프로젝트입니다.",
    },
    host: "localhost:3000",
  };

  const result = await swaggerAutogen(options)(outputFile, routes, doc);
  res.json(result ? result.data : null);
});

// API 라우트
app.post("/api/v1/users/signup", handleUserSignUp); // 회원가입
app.post("/api/v1/stores", handleAddStore); // 가게등록
app.post("/api/v1/stores/:storeId/reviews", handleAddReview); // 리뷰작성
app.post("/api/v1/stores/:storeId/missions", handleAddMission); // 미션등록
app.post("/api/v1/stores/:storeId/missions/:missionId/challenge", handleChallengeMission); // 미션도전

app.get("/api/v1/stores/:storeId/reviews", handleListStoreReviews); // 가게 리뷰 목록
app.get("/api/v1/users/:userId/reviews", handleListUserReviews);  // ✅ 내가 작성한 리뷰 목록
app.get("/api/v1/stores/:storeId/missions", handleListStoreMissions);  // ✅ 특정 가게 미션 목록
app.get("/api/v1/users/:userId/missions/ongoing", handleListUserOngoingMissions);  // ✅ 진행 중인 미션 목록
app.patch("/api/v1/users/:userId/missions/:userMissionId/complete", handleCompleteUserMissions);  // ✅ 미션 완료 처리


// 전역 오류 처리 미들웨어
app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }
  res.status(err.statusCode || 500).error({
    errorCode: err.errorCode || "unknown",
    reason: err.reason || err.message || null,
    data: err.data || null,
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});