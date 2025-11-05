// 입력 DTO
export const bodyToUserMission = (body, storeId, missionId) => ({
  user_id: body.user_id,
  store_id: storeId,
  mission_id: missionId,
});



export const responseFromUserMission = (mission) => ({
  user_mission_id: mission.user_mission_id,
  user_id: mission.user_id,
  mission_id: mission.mission_id,
  store_id: mission.store_id,
  mission_status: mission.mission_status,
  started_at: mission.started_at || new Date(),
});