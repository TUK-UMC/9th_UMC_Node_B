/*
1. 컨트롤러 부분에서 말씀드렸지만 bodyToMission에 인자를 두개를 받아주면 관리하기 더 편하다
->export const bodyToMission = (body, storeId) => {...}
2, dto는 입력/ 출력에 관련된 두가지 버전으로 작성해주는게 좋다.
*/

//클라이언트가 새 미션을 만들 때 보내는 데이터 -> DB에 넣기 전에 가공하는 역할
//입력 DTO -> mission을 생성하는 용도
export const bodyToMission = (body, storeId) => ({
  store_id: storeId,
  title: body.title,
  owner_code: body.owner_code,
  description: body.description,
  reward_point: body.reward_point,
  expire_at: body.expire_at
});

//출력 DTO -> mission 조회용
export const responseFromMission = (mission) => ({
mission_id: mission.mission_id,
store_id: mission.store_id,
title: mission.title,
description: mission.description,
reward_point: mission.reward_point,
expire_at: mission.expire_at
});
