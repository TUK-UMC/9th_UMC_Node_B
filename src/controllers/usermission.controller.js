import { challengeMission, listUserOngoingMissions, completeUserMission } from "../services/usermission.service.js";
import { RequestError } from "../errors/systemErrors.js";
import { bodyToUserMission, responseFromUserMission, responseFromUserMissions } from "../dtos/usermission.dto.js";  // ← 응답 DTO 추가

// 미션 도전
export const handleChallengeMission = async (req, res, next) => {
  try {
    console.log("미션 도전 요청:", req.body);
    
    const storeId = Number(req.params.storeId);
    const missionId = Number(req.params.missionId);
    const userId = req.body.user_id;
    
    if (!storeId || !missionId || !userId) {
      throw new RequestError("storeId, missionId, userId는 필수 값입니다.");
    }

    const userMissionDTO = bodyToUserMission(req.body, storeId, missionId);
    const usermission = await challengeMission(userMissionDTO);

    // 표준 응답 형식
    res.success(responseFromUserMission(usermission));
    
  } catch (err) {
    next(err);
  }
};

// 진행 중인 미션 목록 조회
export const handleListUserOngoingMissions = async (req, res, next) => {
  try {
    const userId = parseInt(req.params.userId);
    const cursor = typeof req.query.cursor === "string" ? parseInt(req.query.cursor) : 0;

    const missions = await listUserOngoingMissions(userId, cursor);
    
    // 표준 응답 형식
    res.success(responseFromUserMissions(missions));
    
  } catch (err) {
    next(err);
  }
};

// 진행 중인 미션 완료 처리
export const handleCompleteUserMissions = async (req, res, next) => {
  try {
    const userId = parseInt(req.params.userId);
    const userMissionId = parseInt(req.params.userMissionId);

    const updatedMission = await completeUserMission(userId, userMissionId);
    
    // 표준 응답 형식
    res.success(responseFromUserMission(updatedMission));
    
  } catch (err) {
    next(err);
  }
};