/*
1. 여기서 반환 DTO를 쓴거 너무 좋다.
*/

import {isMissionExist,isAlreadyChallenged,addUserToDB,} from "../repositories/usermission.repository.js";
import { responseFromUserMission } from "../dtos/usermission.dto.js";

export const challengeMission = async (userMissionDTO) => {
  
  //미션 존재 여부 확인
  const missionExists = await isMissionExist(userMissionDTO);
  if (!missionExists) {
    throw new Error(`store_id ${userMissionDTO.store_id}, mission_id ${userMissionDTO.mission_id} 에 해당하는 미션이 존재하지 않습니다.`);
  }

  //이미 도전 중인지 확인
  const already = await isAlreadyChallenged(userMissionDTO);
  if (already) throw new Error("이미 도전 중인 미션입니다.");

  //도전 추가
  const userMissionId = await addUserToDB(userMissionDTO);


  //반환 DTO
  return responseFromUserMission({
    user_mission_id: userMissionId,
    ...userMissionDTO,
    mission_status: "ongoing",
  });
};
