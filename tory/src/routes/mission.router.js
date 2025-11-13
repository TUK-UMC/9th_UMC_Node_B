import express from "express";
import { handleListStoreMissions } from "../controllers/mission.controller.js";

const missionRouter = express.Router();
missionRouter.get("/stores/:storeId/missions", handleListStoreMissions);

export { missionRouter };