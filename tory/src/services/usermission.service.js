import {isMissionExist,isAlreadyChallenged,addUserToDB,} from "../repositories/usermission.repository.js";
import {getAllUserOngoingMissions} from "../repositories/usermission.repository.js";
import {updateMissionStatusToCompleted} from "../repositories/usermission.repository.js";
import { responseFromUserMission } from "../dtos/usermission.dto.js";
import { responseFromUserMissions } from "../dtos/usermission.dto.js";


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

//사용자가 진행중인 미션 목록 조회
export const listUserOngoingMissions = async (userId, cursor) => {
  const missions = await getAllUserOngoingMissions(userId, cursor);

  return responseFromUserMissions(missions)
};

//진행 중인 미션을 완료 처리
export const completeUserMission = async (userId, userMissionId) => {
  const updatedMission = await updateMissionStatusToCompleted(userId, userMissionId);

  if (!updatedMission) {
    //미션이 없거나 이미 완료된 경우에도 정상 응답
    return {
      message: "완료 가능한 진행 중인 미션이 없습니다.",
      result: null,
    };
  }

  //정상 완료된 경우
  return {
    message: "미션이 성공적으로 완료되었습니다!",
    result: responseFromUserMission(updatedMission),
  };
};