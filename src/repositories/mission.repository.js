import { prisma } from "../db.config.js";

//가게 존재 여부 확인
export const isStoreExist = async (data) => {
  const store = await prisma.store.findUnique({
    where:{
      store_id: data.store_id
    }
  });
  return !!store //존재하면 ture!!
};

// 미션 추가
export const addMissionToDB = async (data) => {
  try{
    const createdMission = await prisma.mission.create({
      data:{
        store_id: data.store_id,
        title: data.title,
        owner_code: data.owner_code,
        description: data.description,
        reward_point: data.reward_point,
        expire_at: data.expire_at
      }
    });
   return createdMission;
  }catch(err){
    if(err.code === "P2003"){
      throw new Error("해당하는 가게가 존재하지 않습니다.");
    }
    throw err;
  }

};

//특정 가게에서의 미션 목록 조회
export const getAllStoreMissions = async (storeId, cursor) => {
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
  return missions;
};