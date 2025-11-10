import {
  responseFromMission,
  responseFromUserMission,
} from "../dtos/mission.dto.js";
import { checkStoreExists } from "../repositories/store.repository.js";
import {
  addMission,
  getMission,
  addUserMission,
  getUserMission,
} from "../repositories/mission.repository.js";

export const missionRegister = async (data) => {
  const storeExists = await checkStoreExists(data.storeId);
  if (!storeExists) {
    throw new Error("존재하지 않는 가게입니다.");
  }

  const missionId = await addMission({
    storeId: data.storeId,
    reward: data.reward,
    deadline: data.deadline,
    missionSpec: data.missionSpec,
  });

  const mission = await getMission(missionId);

  return responseFromMission({ mission });
};

export const missionChallenge = async (data) => {
  const mission = await getMission(data.missionId);
  if (!mission) {
    throw new Error("존재하지 않는 미션입니다.");
  }

  const userMissionId = await addUserMission({
    userId: data.userId,
    missionId: data.missionId,
  });

  const userMission = await getUserMission(userMissionId);

  return responseFromUserMission({ userMission });
};