/*
1. 결과반환도 DTO로 관리해주면 더 편하다.
-> 나중에 다른 API를 만들때고 응답 형식이 같을 경우가 많기 때문에 DTO로 관리하면 더 편하게 개발할 수 있다.
-> 이렇게 했을 시 프론트앤드 연동도 편해진다.
*/

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