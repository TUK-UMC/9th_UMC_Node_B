import { isStoreExist, insertMission } from "../repositories/mission.repository.js";
import { responseFromMission } from "../dtos/mission.dto.js";
import { NotFoundError, RequestError } from "../utils/systemErrors.js";


export const addMission = async (storeId, data) => {
const storeExists = await isStoreExist(storeId);
if (!storeExists) throw new NotFoundError(`store_id ${storeId}에 해당하는 가게가 존재하지 않습니다.`);


const missionId = await insertMission(storeId, data);
if (!missionId) throw new RequestError("미션 등록에 실패했습니다.");


return responseFromMission({ mission_id: missionId, store_id: storeId, ...data });
};