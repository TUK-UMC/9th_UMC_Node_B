import { StatusCodes } from "http-status-codes";
import { challengeMission, listUserOngoingMissions, completeUserMission } from "../services/usermission.service.js";
import { RequestError } from "../errors/systemErrors.js";

export const handleChallengeMission = async (req, res, next) => {
  try {
    console.log("미션 도전 요청:", req.body);

    const storeId = Number(req.params.storeId);
    const missionId = Number(req.params.missionId);
    const userId = req.body.user_id;

    if (!storeId || !missionId || !userId) {
      throw new RequestError("storeId, missionId, userId는 필수 값입니다.");
    }

    const userMissionDTO = { user_id: userId, store_id: storeId, mission_id: missionId };
    const usermission = await challengeMission(userMissionDTO);

    res.status(StatusCodes.CREATED).json({
      success: true,
      message: "미션 도전 등록이 완료되었습니다.",
      data: usermission,
    });
  } catch (err) {
    next(err);
  }
};

export const handleListUserOngoingMissions = async (req, res, next) => {
  try {
    const userId = parseInt(req.params.userId);
    const cursor = typeof req.query.cursor === "string" ? parseInt(req.query.cursor) : 0;

    const missions = await listUserOngoingMissions(userId, cursor);
    res.status(StatusCodes.OK).json({
      success: true,
      message: "진행 중인 미션 목록 조회 성공",
      data: missions,
    });
  } catch (err) {
    next(err);
  }
};

export const handleCompleteUserMissions = async (req, res, next) => {
  try {
    const userId = parseInt(req.params.userId);
    const userMissionId = parseInt(req.params.userMissionId);

    const result = await completeUserMission(userId, userMissionId);
    res.status(StatusCodes.OK).json({
      success: true,
      message: result.message,
      data: result.result, // null or mission
    });
  } catch (err) {
    next(err);
  }
};