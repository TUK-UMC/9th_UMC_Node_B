/*※웬만하면 에러 핸들링 사용하지 말것※*/
import { prisma } from "../config/db.config.js";

//미션 존재 여부 확인
export const isMissionExist = async (data) => {
  return prisma.mission.findFirst({
      where:{
        store_id: data.store_id,
        mission_id: data.mission_id
      }
    });
};

//이미 도전 중인지 확인
export const isAlreadyChallenged = async (data) => {
  return prisma.usermission.findFirst({
    where:{
      user_id: data.user_id,
      mission_id: data.mission_id,
      mission_status: "ongoing"
    }
  });
};

//새로운 도전 추가
export const addUserMissionToDB = async (data) => {
  return prisma.usermission.create({
    data:{
      user_id: data.user_id,
      mission_id: data.mission_id,
      store_id: data.store_id,
      mission_status: "ongoing",
      started_at: new Date(),
      success_flag: false
    }
  });
};

//사용자가 진행 중인 미션 목록 조회
export const getAllUserOngoingMissions = async (userId, cursor) => {
  return prisma.usermission.findMany({
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
};

//진행 중인 미션을 완료 상태로 업데이트
export const updateMissionStatusToCompleted = async (userId, userMissionId) => {
  return prisma.usermission.update({
    where: {
      user_mission_id: userMissionId,
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
};

export const findMissionById = async (storeId, missionId) => {
  return prisma.mission.findFirst({
    where:{
      store_id: storeId,
      mission_id: missionId,
    }
  });
};

export const findUsermissionById = async (userMissionId) => {
  return prisma.usermission.findUnique({
    where:{
      user_mission_id:userMissionId
    }
  });
}; 