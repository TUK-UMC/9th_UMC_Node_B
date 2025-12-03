//입력 DTO -> mission을 생성하는 용도
export const bodyToMission = (body, storeId) => ({
  store_id: storeId,
  title: body.title,
  owner_code: body.owner_code,
  description: body.description,
  reward_point: body.reward_point,
  expire_at: body.expire_at ? new Date(body.expire_at) : new Date()
});

//출력 DTO -> mission 조회용
export const responseFromMission = (mission) => ({
  mission_id: mission.mission_id,
  store_id: mission.store_id,
  title: mission.title,
  description: mission.description,
  reward_point: mission.reward_point,
  expire_at: mission.expire_at,
  created_at: mission.created_at,
  updated_at: mission.updated_at
});

//미션 목록 조회 DTO
export const responseFromMissions = (missions) => {
  const result = {
    data: missions,
    pagination:{
      cursor: missions.length ? missions[missions.length - 1].mission_id:null
    }
  };
  return result;
};