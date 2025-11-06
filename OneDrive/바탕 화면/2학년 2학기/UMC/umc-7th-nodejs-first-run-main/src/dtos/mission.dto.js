export const bodyToMission = (body) => {
  return {
    title: body.title,
    owner_code: body.owner_code,
    description: body.description,
    reward_point: body.reward_point,
    expire_at: body.expire_at,
  };
};

export const responseFromMission = (data) => {
  return {
    mission_id: data.mission_id,
    store_id: data.store_id,
    title: data.title,
    description: data.description,
    reward_point: data.reward_point,
    expire_at: data.expire_at,
  };
};