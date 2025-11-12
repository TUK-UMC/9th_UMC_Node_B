import { isStoreExist, addMissionToDB, getAllStoreMissions } from "../repositories/mission.repository.js";
import { responseFromMission, responseFromMissions } from "../dtos/mission.dto.js";
import { NotFoundError, RequestError } from "../errors/systemErrors.js";

export const addMission = async (missionDTO) => {
  const storeExists = await isStoreExist(missionDTO);
  if (!storeExists) {
    throw new NotFoundError(`store_id ${missionDTO.store_id}에 해당하는 가게가 존재하지 않습니다.`);
  }

  const createdMission = await addMissionToDB(missionDTO);
  if (!createdMission) throw new RequestError("미션 등록에 실패했습니다.");

  return responseFromMission(createdMission);
};

export const listStoreMissions = async (storeId, cursor) => {
  const missions = await getAllStoreMissions(storeId, cursor);
  return responseFromMissions(missions);
};