import { isStoreExist, insertMission } from "../repositories/mission.repository.js";
import { responseFromMission } from "../dtos/mission.dto.js";

export const addMission = async (storeId, data) => {
  // 가게 존재 여부 검증
  const storeExists = await isStoreExist(storeId);
  if (!storeExists) {
    throw new Error(`store_id ${storeId}에 해당하는 가게가 존재하지 않습니다.`);
  }

  // 미션 추가
  const missionId = await insertMission(storeId, data);
  if (!missionId) {
    throw new Error("미션 등록에 실패했습니다.");
  }

  // 결과 반환
  return responseFromMission({ mission_id: missionId, store_id: storeId, ...data });
};
