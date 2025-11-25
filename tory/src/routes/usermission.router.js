import express from "express";
import { handleListUserOngoingMissions, handleCompleteUserMissions, handleChallengeMission } from "../controllers/usermission.controller.js";
import { isLogin } from "../middlewares/islogin.middleware.js";

const userMissionRouter = express.Router();

//미션 도전
userMissionRouter.post("/stores/:storeId/missions/:missionId/challenge", isLogin, handleChallengeMission);
userMissionRouter.get("/missions/me", isLogin, handleListUserOngoingMissions);
userMissionRouter.patch("/users/me/missions/:userMissionId/complete", isLogin, handleCompleteUserMissions);
export { userMissionRouter };