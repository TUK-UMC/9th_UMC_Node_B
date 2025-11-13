
import { isStoreExist, addMissionToDB } from "../repositories/mission.repository.js";
import { responseFromMission } from "../dtos/mission.dto.js";

import { getAllStoreMissions } from "../repositories/mission.repository.js";
import { responseFromMissions } from "../dtos/mission.dto.js";

export const addMission = async (missionDTO) => {
  // 가게 존재 여부 검증
  const storeExists = await isStoreExist(missionDTO);
  if (!storeExists) {
    throw new Error(`store_id ${missionDTO.store_id}에 해당하는 가게가 존재하지 않습니다.`);
  }

  // 미션 추가
  const createdMission = await addMissionToDB(missionDTO);
  if (!createdMission) throw new Error("미션 등록에 실패했습니다.");


  // 결과 반환 -> DTO로 반환
  return responseFromMission(createdMission);
};

// 특정 가게에서의 미션 조회
export const listStoreMissions = async (storeId, cursor) => {
  const missions = await getAllStoreMissions(storeId, cursor);

  return responseFromMissions(missions);
}
