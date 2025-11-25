// 입력 DTO
export const bodyToUserMission = (body, storeId, missionId) => ({
  user_id: body.user_id,
  store_id: storeId,
  mission_id: missionId,
});

//출력 DTO
export const responseFromUserMission = (mission) => ({
  user_mission_id: mission.user_mission_id,
  user_id: mission.user_id,
  mission_id: mission.mission_id,
  store_id: mission.store_id,
  mission_status: mission.mission_status,
  started_at: mission.started_at,
  completed_at: mission.completed_at || null,
  success_flag: mission.success_flag ?? false,
});

//진행중인 미션 목록 조회 DTO
export const responseFromUserMissions = (missions) => {
  const result = {
    data: missions,
    pagination: {
      cursor: missions.length ? missions[missions.length - 1]. user_mission_id : null,
    }
  };
  return result;
}

