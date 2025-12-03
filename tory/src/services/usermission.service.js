import {
  isMissionExist,
  isAlreadyChallenged,
  addUserMissionToDB, 
  getAllUserOngoingMissions,
  updateMissionStatusToCompleted,
  findUsermissionById
} from "../repositories/usermission.repository.js";
import { responseFromUserMission, responseFromUserMissions } from "../dtos/usermission.dto.js";
import { InternalServerError, NotFoundError, RequestError } from "../errors/systemErrors.js";


export const challengeMission = async (userMissionDTO) => {

  //미션 존재 여부 확인
  const existMission  = await isMissionExist(userMissionDTO);
  if(!existMission ){
    throw new NotFoundError("해당 미션을 찾을 수 없음");
  }
  //이미 도전 중인지 확인
  const alreadyChallengedUserMission = await isAlreadyChallenged(userMissionDTO);
  if (alreadyChallengedUserMission){ 
    throw new RequestError("이미 도전 중인 미션");
  }

  //도전 추가
  const userMissionId = await addUserMissionToDB(userMissionDTO);
  if (!userMissionId) {
    throw new InternalServerError("미션 도전 실패.");
  }

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
  if (!missions || missions.length === 0) {
    throw new NotFoundError("사용자가 진행 중인 미션이 없습니다.");
  }
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
    throw new Error("이미 완료된 미션입니다.");
  }

  const updatedMission = await updateMissionStatusToCompleted(userId, userMissionId);
  if (!updatedMission) {
    throw new InternalServerError("미션 완료 처리 중 오류가 발생했습니다.");
  }
  return {
    result: responseFromUserMission(updatedMission),
  };
};