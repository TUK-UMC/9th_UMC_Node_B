import { prisma } from "../db.config.js";
import { NotFoundError, RequestError } from "../errors/systemErrors.js";

//가게 존재 여부 확인
export const isStoreExist = async (storeId) => {
  const store = await prisma.store.findFirst({
    where:{
      store_id: storeId
    }
  });
  if (!store){
    throw new NotFoundError(`해당 store_id: ${storeId}의 가게를 찾을 수 없습니다.`);
  }
  return store;
};

// 미션 추가(필요한 것: 값 존재하는지, 미션 생성 하기,)
export const addMissionToDB = async (data) => {
  //입력값이 누락이 되었는지 확인
  if(!data.store_id || !data.title || !data.reward_point){
    throw new RequestError("필수 입력 값이 누락되었습니다.");
  }
  //미션 생성
  const createdMission = await prisma.mission.create({
    data:{
      store_id: data.store_id,
      title: data.title,
      owner_code: data.owner_code,
      description: data.description,
      reward_point: data.reward_point,
      expire_at: data.expire_at,
    }
  });
  return createdMission;
};

//특정 가게에서의 미션 목록 조회
export const getAllStoreMissions = async (storeId, cursor) => {
  /// 가게 존재 여부 확인
  await isStoreExist(storeId);

  const missions = await prisma.mission.findMany({
    select: {
      mission_id: true,
      title: true,
      description: true,
      reward_point: true,
      expire_at:true,
      created_at: true
    },
    where: {
      store_id: storeId,
      mission_id: {
        gt: cursor
      }
    },
    orderBy:{
      mission_id: "asc"
    },
    take: 5
  });
  //미션이 하나도 없는 경우
  if(!missions || missions.length == 0){
    throw new NotFoundError("해당 가게에 등록된 미션이 없습니다.");
  }
  return missions;
};