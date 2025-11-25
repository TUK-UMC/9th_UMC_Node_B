import express from "express";
import { handleAddMission, handleListStoreMissions } from "../controllers/mission.controller.js";
import { isLogin } from "../middlewares/islogin.middleware.js";

const missionRouter = express.Router();
//미션 추가 (로그인이 필요)
missionRouter.post("/stores/:storeId/missions", isLogin, handleAddMission);
//가게 미션 조회
missionRouter.get("/stores/:storeId/missions", handleListStoreMissions);

export { missionRouter };
