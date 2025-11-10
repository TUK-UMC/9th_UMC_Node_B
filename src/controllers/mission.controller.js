import { addMission, listStoreMissions } from "../services/mission.service.js";
import { bodyToMission, responseFromMission, responseFromMissions } from "../dtos/mission.dto.js";  // ← 응답 DTO 추가
import { NotFoundError } from "../errors/systemErrors.js";

// 미션 추가
export const handleAddMission = async (req, res, next) => {
  try {
    const storeId = Number(req.params.storeId);
    console.log(`Mission 요청 storeId: ${storeId}`);

    if (!storeId) {
      throw new NotFoundError("storeId 값이 존재하지 않습니다!");
    }

    const missionDTO = bodyToMission(req.body, storeId);
    const mission = await addMission(missionDTO);

    // 표준 응답 형식
    res.success(responseFromMission(mission));
    
  } catch (err) {
    next(err);
  }
};

// 특정 가게 미션 목록 조회
export const handleListStoreMissions = async (req, res, next) => {
  try {
    const storeId = parseInt(req.params.storeId);
    const cursor = typeof req.query.cursor === "string" ? parseInt(req.query.cursor) : 0;

    const missions = await listStoreMissions(storeId, cursor);
    
    // 표준 응답 형식
    res.success(responseFromMissions(missions));
    
  } catch (err) {
    next(err);
  }
};