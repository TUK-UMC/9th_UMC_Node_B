import {
  isMissionExist,
  isAlreadyChallenged,
  addUserToDB as addUserMissionToDB,
  getAllUserOngoingMissions,
  updateMissionStatusToCompleted,
} from "../repositories/usermission.repository.js";
import { responseFromUserMission, responseFromUserMissions } from "../dtos/usermission.dto.js";
import { NotFoundError, ConflictError } from "../errors/systemErrors.js";

export const challengeMission = async (userMissionDTO) => {
  const missionExists = await isMissionExist(userMissionDTO);
  if (!missionExists) {
    throw new NotFoundError(
      `store_id ${userMissionDTO.store_id}, mission_id ${userMissionDTO.mission_id} 에 해당하는 미션이 존재하지 않습니다.`
    );
  }

  const already = await isAlreadyChallenged(userMissionDTO);
  if (already) throw new ConflictError("이미 도전 중인 미션입니다.");

  const userMissionId = await addUserMissionToDB(userMissionDTO);

  return responseFromUserMission({
    user_mission_id: userMissionId,
    ...userMissionDTO,
    mission_status: "ongoing",
  });
};

export const listUserOngoingMissions = async (userId, cursor) => {
  const missions = await getAllUserOngoingMissions(userId, cursor);
  return responseFromUserMissions(missions);
};

export const completeUserMission = async (userId, userMissionId) => {
  const updatedMission = await updateMissionStatusToCompleted(userId, userMissionId);

  if (!updatedMission) {
    return { message: "완료 가능한 진행 중인 미션이 없습니다.", result: null };
  }

  return { message: "미션이 성공적으로 완료되었습니다!", result: responseFromUserMission(updatedMission) };
};