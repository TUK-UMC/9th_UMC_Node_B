import { isStoreExist, addMissionToDB, getAllStoreMissions } from "../repositories/mission.repository.js";
import { responseFromMission, responseFromMissions } from "../dtos/mission.dto.js";
import { InternalServerError } from "../errors/systemErrors.js";

export const addMission = async (missionDTO) => {
  // 가게 존재 여부 검증
  await isStoreExist(missionDTO.store_id);

  // 미션 추가
  const createdMission = await addMissionToDB(missionDTO);
  if (!createdMission) throw new InternalServerError("미션 등록에 실패했습니다.");

  // 결과 반환 -> DTO로 반환
  return responseFromMission(createdMission);
};

// 특정 가게에서의 미션 조회
export const listStoreMissions = async (storeId, cursor) => {
  const missions = await getAllStoreMissions(storeId, cursor);
  return responseFromMissions(missions);
}
