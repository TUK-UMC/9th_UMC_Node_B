import { StatusCodes } from "http-status-codes";
import { addMission, listStoreMissions } from "../services/mission.service.js";
import { bodyToMission } from "../dtos/mission.dto.js";
import { NotFoundError } from "../errors/systemErrors.js";

export const handleAddMission = async (req, res, next) => {
  try {
    const storeId = Number(req.params.storeId);
    console.log(`Mission 요청 storeId: ${storeId}`);

    if (!storeId) throw new NotFoundError("storeId 값이 존재하지 않습니다!");

    const missionDTO = bodyToMission(req.body, storeId);
    const mission = await addMission(missionDTO);

    res.status(StatusCodes.CREATED).json({
      success: true,
      message: "미션이 성공적으로 추가되었습니다.",
      data: mission,
    });
  } catch (err) {
    next(err);
  }
};

// 특정 가게에서의 미션 조회
export const handleListStoreMissions = async (req, res, next) => {
  try {
    const storeId = parseInt(req.params.storeId);
    const cursor = typeof req.query.cursor === "string" ? parseInt(req.query.cursor) : 0;

    const missions = await listStoreMissions(storeId, cursor);
    res.status(StatusCodes.OK).json({
      success: true,
      message: "미션 목록 조회 성공",
      data: missions,
    });
  } catch (err) {
    next(err);
  }
};