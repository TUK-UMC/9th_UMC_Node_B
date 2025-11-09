import { prisma } from "../db.config.js";

//미션 존재 여부 확인
export const isMissionExist = async (data) => {
  const mission = await prisma.mission.findFirst({
      where:{
        store_id: data.store_id,
        mission_id: data.mission_id
      }
    });
    return !!mission //존재하면 ture!!
};

//이미 도전 중인지 확인
export const isAlreadyChallenged = async (data) => {
  const challenge  = await prisma.usermission.findFirst({
    where:{
      user_id: data.user_id,
      mission_id: data.mission_id,
      mission_status: "ongoing"
    }
  });
  return !!challenge ;
};

//새로운 도전 추가
export const addUserToDB = async (data) => {
  try{
    const createdChallenge = await prisma.usermission.create({
      data:{
        user_id: data.user_id,
        mission_id: data.mission_id,
        store_id: data.store_id,
        mission_status: "ongoing",
        started_at: new Date(),
        success_flag: false
      }
    });
    return createdChallenge.user_mission_id;
  }catch(err){
    if(err.code === "P2003"){
      throw new Error(`store_id ${data.store_id} 또는 mission_id ${data.mission_id}가 존재하지 않습니다.`);
    }
    throw err;
  }
};

//사용자가 진행 중인 미션 목록 조회
export const getAllUserOngoingMissions = async (userId, cursor) => {
  const missions = await prisma.usermission.findMany({
    select: {
      user_mission_id: true,
      mission_status: true,
      started_at: true,
      completed_at: true,
      success_flag: true,
      mission: {
        select:{
          mission_id: true,
          title: true,
          reward_point: true,
          expire_at: true
        }
      },
      store: {
        select:{
          store_id: true,
          store_name: true
        }
      }
    },
    where: {
      user_id: userId,
      mission_status: "ongoing",
      user_mission_id: {gt: cursor}
    },
    orderBy: {user_mission_id: "asc"},
    take: 5
  });
  return missions;
};

//진행 중인 미션을 완료 상태로 없데이트
//진행 중인 미션을 완료 상태로 업데이트
export const updateMissionStatusToCompleted = async (userId, userMissionId) => {
  try {
    const updated = await prisma.usermission.update({
      where: {
        user_mission_id: userMissionId,
        // user_id도 추가 검증
        // user_id: userId, // (unique 제약이 없으면 where로 동시에 못 씀)
      },
      data: {
        mission_status: "completed",
        completed_at: new Date(),
        success_flag: true
      },
      include: {
        mission: {
          select: {
            mission_id: true,
            title: true,
            reward_point: true,
            expire_at: true
          }
        },
        store: {
          select: {
            store_id: true,
            store_name: true
          }
        },
        user: {
          select: {
            user_id: true,
            user_name: true
          }
        }
      }
    });

    return updated;
  } catch (err) {
    if (err.code === "P2025") {
      return null;
    }
    throw err;
  }
};