/*※입력값 유효성 검증을 여기서 하는 방향으로※*/
import { StatusCodes } from "http-status-codes"; 
import { addMission, listStoreMissions } from "../services/mission.service.js";
import { bodyToMission } from "../dtos/mission.dto.js";
import { CustomError } from "../errors/customError.js";
import { successHandler } from "../middlewares/successHandler.js";


/* 
[성공]
1. 미션 추가 성공(추가)
2. 미션 조회 성공(조회)
[에러]
1. 가게를 찾을 수 없을 때(추가)
2. 필수 값을 입력x -> 추가 할 때(추가)
3. 해당 가게가 존재 하지 않을때(조회)
4. 미션이 아예 존재 하지 않을때(조회)
*/
export const handleAddMission = async (req, res, next) => {
/*
  #swagger.tags = ['stores']
  #swagger.summary = '미션 추가 API';

  #swagger.requestBody = {
    required: true,
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            title: { type: "string" },
            owner_code: { type: "string" },
            description: { type: "string" },
            reward_point: { type: "number" },
            expire_at: { type: "string", format: "date-time" }
          },
          required: ["title", "reward_point"]
        }
      }
    }
  };
  
  #swagger.responses[201] = {
    description: "미션 추가 성공",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            isSuccess: { type: "boolean", example: "true" },
            code: { type: "number", example: 201 },
            message: { type: "string", example: "미션 추가 성공"},
            data: {
              type: "object",
              properties: {
                mission_id: { type: "number" },
                store_id: { type: "number" },
                title: { type: "string" },
                description: { type: "string" },
                reward_point: {type: "number"},
                expire_at: { type: "string", format: "date-time" },
                created_at: { type: "string", format: "date-time" },
                updated_at: { type: "string", format: "date-time" },
              }
            }
          }
        }
      }
    }
  };

  #swagger.responses[400] = {
    description: "필수 입력값(title, reward_point)이 누락된 경우",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            isSuccess: { type: "boolean", example: false },
            code: { type: "number", example: 400 },
            message: { type: "string", example: "title과 reward_point 필수 입력값입니다." },
          }
        }
      }
    }
  };

  #swagger.responses[404] = {
    description: "해당 가게를 찾을 수 없습니다.",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            isSuccess: { type: "boolean", example: false },
            code: { type: "number", example: 404 },
            message: { type: "string", example: "해당 가게를 찾을 수 없습니다."},
          }
        }
      }
    }
  };

  #swagger.responses[500] = {
    description: "서버 내부 오류",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            isSuccess: { type: "boolean", example: false },
            code: { type: "number", example: 500 },
            message: { type: "string"},
          }
        }
      }
    }
  };
*/
  try {
    const storeId = Number(req.params.storeId);
    
    //입력값 유효성 검증
    const { title, reward_point } = req.body;
    if(!title || !reward_point){
      throw new CustomError(StatusCodes.BAD_REQUEST,"title과 reward_point 필수 입력값입니다.");
    }
    
    //dto 변환
    const missionDTO = bodyToMission(req.body, storeId);
    //비즈니스 로직을 호출
    const mission = await addMission(missionDTO);
    
    return successHandler(
      res, 
      StatusCodes.CREATED, 
      "미션 추가 성공", 
      mission
    );
  } catch (err) { //에러가 발생시 에러 핸들러로 전달
    next(err);
  }
};

//특정 가게에서의 미션 조회
export const handleListStoreMissions = async(req, res, next) => {
/*
  #swagger.tags = ['stores']
  #swagger.summary = '특정 가게에서의 미션 목록 조회 API'

  #swagger.parameters['storeId'] = {
    in: 'path',
    required: true,
    description: '미션를 조회할 storeId',
    schema: { type: "number" }
  }

  #swagger.parameters['cursor'] = {
    in: 'query',
    required: false,
    description: '페이지네이션용 커서',
    schema: { type: "number", example: 10 }
  }

  #swagger.responses[200] = {
    description: "가게 미션 목록 조회 성공",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            isSuccess: { type: "boolean", example: true},
            code: { type: "number", example: 200},
            message: {type: "string", example: "가게 미션 목록 조회 성공"},
            data: {
              type: "object",
              properties: {
                data: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      mission_id: {type: "number"},
                      title: { type: "string"},
                      reward_point: {type: "number"},
                      expire_at: {type: "string", format: "date-time"}
                    }
                  }
                },
                pagination: {
                  type: "object",
                  properties: {
                    cursor: {type: "number"}
                  }
                }
              }
            }
          }
        }
      }
    }  
  };

  #swagger.responses[404] = {
  description: "가게가 존재하지 않거나 등록된 미션이 없는 경우",
  content: {
    "application/json": {
      schema: {
        type: "object",
        properties: {
          isSuccess: { type: "boolean", example: false },
          code: { type: "number", example: 404 },
          message: { type: "string", example: "해당 가게에 등록된 미션이 없습니다." }
        }
      }
    }
  }
};
*/
  try {
    const storeId = parseInt(req.params.storeId);

    //입력값 유호성 검증
    if(!storeId || isNaN(storeId)){
      throw new CustomError(StatusCodes.BAD_REQUEST, "유효한 storeId 필요");
    }
    
    //가게 미션 조회 API에서 페이징 처리를 위한 초기 cursor값
    let cursor = 0;
    if(req.query.cursor){
      cursor = Number(req.query.cursor);
      if(isNaN(cursor) || cursor < 0){
        throw new CustomError(StatusCodes.BAD_REQUEST, "cursor는 0 이상의 숫자여야 한다.");
      }
    }

    const missions = await listStoreMissions(storeId, cursor);
    return successHandler(
      res, 
      StatusCodes.OK, 
      "가게 미션 목록 조회 성공", 
      missions
    );
  }catch(err){
    next(err);
  }
};