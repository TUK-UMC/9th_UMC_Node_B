import {
  isMissionExist,
  isAlreadyChallenged,
  addUserMissionToDB, 
  getAllUserOngoingMissions,
  updateMissionStatusToCompleted,
  findUsermissionById
} from "../repositories/usermission.repository.js";
import { responseFromUserMission, responseFromUserMissions } from "../dtos/usermission.dto.js";
import { NotFoundError, RequestError } from "../errors/systemErrors.js";


export const challengeMission = async (userMissionDTO) => {
  
  //미션 존재 여부 확인
  await isMissionExist(userMissionDTO);

  //이미 도전 중인지 확인
  const already = await isAlreadyChallenged(userMissionDTO);
  if (already){ 
    throw new RequestError("이미 도전 중인 미션입니다.");
  }

  //도전 추가
  const userMissionId = await addUserMissionToDB(userMissionDTO);


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
  //진행 중인 미션이 있는지 확인
  const userMission = await findUsermissionById(userMissionId);
  if(!userMission){
    throw new NotFoundError(`user_misison_id: ${userMissionId}인 미션이 존재하지 않습니다.`);
  }

  //이미 완료 처리를 했을때에 대한 에러문
  if(userMission.mission_status === "completed"){
    throw new Error("이미 완료된 미션입니다. 다시 완료 처리 할 수 없습니다.");
  }

  const updatedMission = await updateMissionStatusToCompleted(userId, userMissionId);
  //정상 완료된 경우
  return {
    message: "미션이 성공적으로 완료되었습니다!",
    result: responseFromUserMission(updatedMission),
  };
};