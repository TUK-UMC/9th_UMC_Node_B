export const responseFromUserMission = (data) => {
  return {
    user_mission_id: data.user_mission_id,
    user_id: data.user_id,
    mission_id: data.mission_id,
    store_id: data.store_id,
    mission_status: data.mission_status,
  };
};
