import express from "express";
import { handleListUserOngoingMissions, handleCompleteUserMissions } from "../controllers/usermission.controller.js";

const userMissionRouter = express.Router();
userMissionRouter.get("/users/:userId/missions", handleListUserOngoingMissions);
userMissionRouter.patch("/users/:userId/missions/:userMissionId/complete", handleCompleteUserMissions);
export { userMissionRouter };