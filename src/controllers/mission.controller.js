import { StatusCodes } from "http-status-codes";
import { bodyToMission, responseFromMission, bodyToChallengeMission, responseFromUserMission } from "../dtos/mission.dto.js";
import { missionRegister, missionChallenge } from "../services/mission.service.js";

export const handleMissionRegister = async (req, res, next) => {
  const mission = await missionRegister(bodyToMission(req.body));
  res.status(StatusCodes.CREATED).json({ result: responseFromMission({ mission }) });
};

export const handleMissionChallenge = async (req, res, next) => {
  const userMission = await missionChallenge(bodyToChallengeMission(req.body));
  res.status(StatusCodes.CREATED).json({ result: responseFromUserMission({ userMission }) });
};