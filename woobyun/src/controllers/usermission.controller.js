/*※입력값 유효성 검증을 여기서 하는 방향으로※*/
import { StatusCodes } from "http-status-codes";
import { challengeMission, listUserOngoingMissions, completeUserMission } from "../services/usermission.service.js";
import { bodyToUserMission} from "../dtos/usermission.dto.js";
import { successHandler } from "../middlewares/successHandler.js";
import { CustomError } from "../errors/customError.js";

/* 
[성공]
1. 유저 미션 등록 성공(추가)
2. 미션 조회 성공(조회)
[에러]
1. 해당 미션을 찾을 수 없을 경우(등록)
2. 이미 도전 중인 미션인 경우(등록)
3. 미션 추가에 실패한 경우(등록)
4. 사용자가 진행 중인 미션이 없을 경우(조회)
5. 이미 완료 처리된 미션일 경우(완료)
6. 미션 완료 처리에 대한 오류(완료)
*/

export const handleChallengeMission = async (req, res, next) => {
  /*
  #swagger.tags = ['stores']
  #swagger.summary = '사용자 미션 등록 API'

  #swagger.parameters['storeId'] = {
    in: 'path',
    required: true,
    description: '가게 ID',
    schema: { type: "number" }
  }

  #swagger.parameters['missionId'] = {
    in: 'path',
    required: true,
    description: '미션 ID',
    schema: { type: "number" }
  }

  #swagger.requestBody = {
    required: true,
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            user_id: { type: "number" }
          }
        }
      }
    }
  };

  #swagger.responses[201] = {
    description: "미션 도전 등록 성공",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            isSuccess: { type: "boolean", example: true },
            code: { type: "number", example: 201 },
            message: { type: "string", example: "미션 도전 등록 성공" },
            data: {
              type: "object",
              properties: {
                user_mission_id: {
                  type: "object",
                  properties: {
                    user_mission_id: { type: "number" },
                    user_id: { type: "number" },
                    mission_id: { type: "number" },
                    store_id: { type: "number" },
                    mission_status: { type: "string" },
                    started_at: { type: "string" },
                    completed_at: { type: "string", format: "date-time", nullable: true },
                    success_flag: { type: "boolean" },
                    created_at: { type: "string", format: "date-time" },
                    updated_at: { type: "string", format: "date-time" }
                  }
                },
                user_id: { type: "number" },
                mission_id: { type: "number" },
                store_id: { type: "number" },
                mission_status: { type: "string" },
                completed_at: { type: "string", format: "date-time", nullable: true },
                success_flag: { type: "boolean" }
              }
            }
          }
        }
      }
    }
  };
*/

  try {    
    const storeId = Number(req.params.storeId);
    const missionId = Number(req.params.missionId);

    //유효한 값 검증
    if (!storeId || isNaN(storeId)) {
      throw new CustomError(StatusCodes.BAD_REQUEST, "유효한 storeId 필요");
    }
    if (!missionId || isNaN(missionId)) {
      throw new CustomError(StatusCodes.BAD_REQUEST, "유효한 missionId 필요");
    }

    //dto 변환
    const userMissionDTO = bodyToUserMission(req.body, storeId, missionId);
    //비즈니스 로직을 호출
    const usermission = await challengeMission(userMissionDTO);
    return successHandler(
      res, 
      StatusCodes.CREATED, 
      "유저 미션 도전 등록 성공", 
      usermission
    );
  } catch (err) {//에러가 발생했을 때 실행되는 부분
    next(err);
  }
};

//진행 중인 미션 목록 조회
export const handleListUserOngoingMissions = async(req, res, next) => {
  /*
  #swagger.tags = ['users']
  #swagger.summary = '진행 중인 사용자 미션 목록 조회 API'

  #swagger.parameters['userId'] = {
    in: 'path',
    required: true,
    description: '사용자 ID',
    schema: { type: "number" }
  }

  #swagger.parameters['cursor'] = {
    in: 'query',
    required: false,
    description: '페이지네이션 커서',
    schema: { type: "number" }
  }

  #swagger.responses[200] = {
    description: "진행 중 미션 목록 조회 성공",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            isSuccess: { type: "boolean", example: true },
            code: { type: "number", example: 200 },
            message: { type: "string", example: "사용자 미션 목록 조회 성공" },
            data: {
              type: "object",
              properties: {

                data: {
                  type: "array",
                  description: "진행 중 미션 목록",
                  items: {
                    type: "object",
                    properties: {
                      user_mission_id: { type: "number" },
                      mission_status: { type: "string" },
                      started_at: { type: "string", format: "date-time" },
                      completed_at: { type: "string", format: "date-time", nullable: true },
                      success_flag: { type: "boolean" },

                      mission: {
                        type: "object",
                        properties: {
                          mission_id: { type: "number" },
                          title: { type: "string" },
                          reward_point: { type: "number" },
                          expire_at: { type: "string", format: "date-time" }
                        }
                      },

                      store: {
                        type: "object",
                        properties: {
                          store_id: { type: "number" },
                          store_name: { type: "string" }
                        }
                      }
                    }
                  }
                },

                pagination: {
                  type: "object",
                  properties: {
                    cursor: { type: "number" }
                  }
                }

              }
            }
          }
        }
      }
    }
  };
*/

  try{
    const userId = Number(req.params.userId);
    if (!userId || isNaN(userId)) {
      throw new CustomError(StatusCodes.BAD_REQUEST, "유효한 userId가 필요합니다.");
    }

    let cursor = 0;
    if (req.query.cursor) {
      cursor = Number(req.query.cursor);
      if (isNaN(cursor) || cursor < 0) {
        throw new CustomError(StatusCodes.BAD_REQUEST, "cursor는 0 이상이여야 함");
      }
    }

    const usermissions = await listUserOngoingMissions(userId, cursor);
    return successHandler(
      res, 
      StatusCodes.OK, 
      "사용자 미션 목록 조회 성공", 
      usermissions
    );
  }catch(err){
    next(err);
  }
};

//진행 중인 미션 완료 처리하기
export const handleCompleteUserMissions = async ( req, res, next) => {
  /*
  #swagger.tags = ['users']
  #swagger.summary = '사용자 미션 완료 처리 API'

  #swagger.parameters['userId'] = {
    in: 'path',
    required: true,
    description: '사용자 ID',
    schema: { type: "number" }
  }

  #swagger.parameters['userMissionId'] = {
    in: 'path',
    required: true,
    description: '유저 미션 ID',
    schema: { type: "number" }
  }

  #swagger.responses[200] = {
    description: "사용자 미션 완료 처리 성공",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            isSuccess: { type: "boolean", example: true },
            code: { type: "number" },
            message: { type: "string", example: "사용자 미션 완료 처리 성공" },
            data: {
              type: "object",
              properties: {
                result: {
                  type: "object",
                  properties: {
                    user_mission_id: { type: "number" },
                    user_id: { type: "number" },
                    mission_id: { type: "number" },
                    store_id: { type: "number" },
                    mission_status: { type: "string" },
                    started_at: { type: "string", format: "date-time" },
                    completed_at: { type: "string", format: "date-time" },
                    success_flag: { type: "boolean" }
                  }
                }
              }
            }
          }
        }
      }
    }
  };
*/

  try{
    const userId = parseInt(req.params.userId);
    const userMissionId = parseInt(req.params.userMissionId);
    
    //유저 미션이 있는지 검증
    if (!userMissionId || isNaN(userMissionId)) {
      throw new CustomError(StatusCodes.BAD_REQUEST, "유효한 userMissionId가 필요합니다.");
    }
    const updatedMission = await completeUserMission(userId, userMissionId);
    return successHandler(
      res, 
      StatusCodes.OK, 
      "미션 완료 처리 성공", 
      updatedMission
    );
  }catch(err){
    next(err);
  }
};
 