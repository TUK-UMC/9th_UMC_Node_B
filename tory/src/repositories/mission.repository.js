import { prisma } from "../config/db.config.js";


//가게 존재 여부 확인
export const isStoreExist = async (storeId) => {
  return prisma.store.findFirst({
    where:{
      store_id: storeId
    }
  });
};
// 미션 추가(필요한 것: 값 존재하는지, 미션 생성 하기,)
export const addMissionToDB = async (data) => {
  //미션 생성
  return prisma.mission.create({
    data:{
      store_id: data.store_id,
      title: data.title,
      owner_code: data.owner_code,
      description: data.description,
      reward_point: data.reward_point,
      expire_at: data.expire_at,
    }
  });
};
//특정 가게에서의 미션 목록 조회
export const getAllStoreMissions = async (storeId, cursor) => {
  return prisma.mission.findMany({
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
};