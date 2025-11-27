import { isStoreExist, addMissionToDB, getAllStoreMissions } from "../repositories/mission.repository.js";
import { responseFromMission, responseFromMissions } from "../dtos/mission.dto.js";
import { InternalServerError, NotFoundError } from "../errors/systemErrors.js";

export const addMission = async (missionDTO) => {
  // 가게 존재 여부 검증
  const store = await isStoreExist(missionDTO.store_id);
  if(!store){
    throw new NotFoundError("해당 가게를 찾을 수 없습니다.");
  }
  // 미션 추가
  const createdMission = await addMissionToDB(missionDTO);
  if (!createdMission){ 
    throw new InternalServerError("미션 등록에 실패했습니다.");
  }
  // 결과 반환 -> DTO로 반환
  return responseFromMission(createdMission);
};

// 특정 가게에서의 미션 조회
export const listStoreMissions = async (storeId, cursor) => {

  // 가게 존재 여부 확인
  const store = await isStoreExist(storeId);
  if(!store){
    throw new NotFoundError("해당 가게를 찾을 수 없습니다.");
  }
  // 미션 목록 조회
  const missions = await getAllStoreMissions(storeId, cursor);
  //미션이 존재 하지 않은 경우
  if(!missions || missions.length === 0){
    throw new NotFoundError("해당 가게에 등록된 미션이 없습니다.");
  }
  return responseFromMissions(missions);
};