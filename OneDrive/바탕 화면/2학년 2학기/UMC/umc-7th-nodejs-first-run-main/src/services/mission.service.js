import * as MissionRepository from "../repository/mission.repository.js";

export const getMissionsByStore = async (storeId) => {
  return await MissionRepository.findMissionsByStore(storeId);
};