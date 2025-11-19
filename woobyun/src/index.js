import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import cookieParser  from "cookie-parser";
import swaggerAutogen from "swagger-autogen";
import swaggerUiExpress from "swagger-ui-express";

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

app.use(
  "/docs",
  swaggerUiExpress.serve,
  swaggerUiExpress.setup({}, {
    swaggerOptions: {
      url: "/openapi.json",
    },
  })
);

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
      title: "UMC 9th Woobyun",
      description: "UMC 9th Node.js 우변/양우영의 워크북 Swagger입니다.",
    },
    host: "localhost:3000",
  };

  const result = await swaggerAutogen(options)(outputFile, routes, doc);
  res.json(result ? result.data : null);
});

app.use(cors()); // cors 방식 허용
app.use(express.static("public")); // 정적 파일 접근
app.use(express.json()); // request의 본문을 json으로 해석할 수 있도록 함 (JSON 형태의 요청 body를 파싱하기 위함)
app.use(express.urlencoded({ extended: false })); // 단순 객체 문자열 형태로 본문 데이터 해석

app.use(morgan("dev")); //로그 포맷: dev
app.use(cookieParser());

//라우터 관련
app.use(`${prefix}`, reviewRouter);
app.use(`${prefix}`, missionRouter);
app.use(`${prefix}`, userMissionRouter);

/*app.get("/", (req, res) => {
  res.send("Hello World!");
});*/

//유저 관련
app.post(`${prefix}/users/signup`, handleUserSignUp);

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


//------------------------------------------------[UMC 워크북 스터디]------------------------------------------------------------//

// // 쿠키 만드는 라우터 
// app.get('/setcookie', (req, res) => {
//     // 'myCookie'라는 이름으로 '양우영' 값을 가진 쿠키를 생성
//     res.cookie('myCookie', '양우영', { maxAge: 60000 }); // 60초간 유효
//     res.send('쿠키가 생성되었습니다!');
// });

// // 쿠키 읽는 라우터 
// app.get('/getcookie', (req, res) => {
//     // cookie-parser 덕분에 req.cookies 객체에서 바로 꺼내 쓸 수 있음
//     const myCookie = req.cookies.myCookie; 
    
//     if (myCookie) {
//         console.log(req.cookies); // { myCookie: 'hello' }
//         res.send(`당신의 쿠키: ${myCookie}`);
//     } else {
//         res.send('쿠키가 없습니다.');
//     }
// });

// const isLogin = (req, res, next) => {
//     // cookie-parser가 만들어준 req.cookies 객체에서 username을 확인
//     const { username } = req.cookies; 

//     if (username) {
     
//         console.log(`[인증 성공] ${username}님, 환영합니다.`);
//         next(); 
//     } else {
    
//         console.log('[인증 실패] 로그인이 필요합니다.');
//         res.status(401).send('<script>alert("로그인이 필요합니다!");location.href="/login";</script>');
//     }
// };


// app.get('/', (req, res) => {
//     res.send(`
//         <h1>메인 페이지</h1>
//         <p>이 페이지는 로그인이 필요 없습니다.</p>
//         <ul>
//             <li><a href="/mypage">마이페이지 (로그인 필요)</a></li>
//         </ul>
//     `);
// });


// app.get('/login', (req, res) => {
//     res.send('<h1>로그인 페이지</h1><p>로그인이 필요한 페이지에서 튕겨나오면 여기로 옵니다.</p>');
// });

// app.get('/set-login', (req, res) => {
//     res.cookie('username', '양우영', { maxAge: 3600000 });
//     res.send('로그인 쿠키(username=양우영) 생성 완료! <a href="/mypage">마이페이지로 이동</a>');
// });

// app.get('/mypage', isLogin, (req, res) => {
//     res.send(`
//         <h1>마이페이지</h1>
//         <p>환영합니다, ${req.cookies.username}님!</p>
//         <p>이 페이지는 로그인한 사람만 볼 수 있습니다.</p>
//     `);
// });


// app.get('/set-logout', (req, res) => {
//     res.clearCookie('username');
//     res.send('로그아웃 완료 (쿠키 삭제). <a href="/">메인으로</a>');
// });

