import {
isMissionExist,
isAlreadyChallenged,
insertUserMission,
} from "../repositories/usermission.repository.js";
import { responseFromUserMission } from "../dtos/usermission.dto.js";
import { NotFoundError, RequestError } from "../utils/systemErrors.js";


export const challengeMission = async (storeId, missionId, userId) => {
const missionExists = await isMissionExist(storeId, missionId);
if (!missionExists) throw new NotFoundError("해당 미션이 존재하지 않습니다.");


const already = await isAlreadyChallenged(userId, missionId);
if (already) throw new RequestError("이미 도전 중인 미션입니다.");


const userMissionId = await insertUserMission(userId, missionId, storeId);


return responseFromUserMission({
user_mission_id: userMissionId,
user_id: userId,
mission_id: missionId,
store_id: storeId,
mission_status: "ongoing",
});
};