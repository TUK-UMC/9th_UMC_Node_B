import { prisma } from "../db.config.js";

export const updateStatusToComplete = async (user_id, mission_id) => {
  return await prisma.userMission.update({
    where: {
      user_id_mission_id: {
        user_id,
        mission_id
      }
    },
    data: {
      status: "COMPLETE"
    }
  });
};