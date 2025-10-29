import {
  isMissionExist,
  isAlreadyChallenged,
  insertUserMission,
} from "../repositories/usermission.repository.js";
import { responseFromUserMission } from "../dtos/usermission.dto.js";

export const challengeMission = async (storeId, missionId, userId) => {
  //미션 존재 여부 확인
  const missionExists = await isMissionExist(storeId, missionId);
  if (!missionExists) {
    throw new Error(`store_id ${storeId}, mission_id ${missionId} 에 해당하는 미션이 존재하지 않습니다.`);
  }

  //이미 도전 중인지 확인
  const already = await isAlreadyChallenged(userId, missionId);
  if (already) {
    throw new Error("이미 도전 중인 미션입니다.");
  }

  //도전 추가
  const userMissionId = await insertUserMission(userId, missionId, storeId);

  //반환 DTO
  return responseFromUserMission({
    user_mission_id: userMissionId,
    user_id: userId,
    mission_id: missionId,
    store_id: storeId,
    mission_status: "ongoing",
  });
};
