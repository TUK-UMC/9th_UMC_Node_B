import * as UserMissionRepository from "../repository/usermission.repository.js";

export const completeMission = async (user_id, mission_id) => {
  return await UserMissionRepository.updateStatusToComplete(user_id, mission_id);
};