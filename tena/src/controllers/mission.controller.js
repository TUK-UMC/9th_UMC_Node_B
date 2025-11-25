import { addMission, listStoreMissions } from "../services/mission.service.js";
import { bodyToMission, responseFromMission, responseFromMissions } from "../dtos/mission.dto.js";
import { NotFoundError } from "../errors/systemErrors.js";

// 미션 추가
export const handleAddMission = async (req, res, next) => {
  /*
    #swagger.summary = '가게 미션 추가 API'
    #swagger.description = '특정 가게에 새로운 미션을 추가합니다.'
    #swagger.parameters['storeId'] = { description: '가게 ID', in: 'path', required: true, type: 'integer' }
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              title: { type: "string" },
              reward_point: { type: "number" },
              expire_at: { type: "string", format: "date-time" }
            },
            required: ["title", "reward_point", "expire_at"]
          }
        }
      }
    }
    #swagger.responses[200] = {
      description: "미션 추가 성공",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              resultType: { type: "string", example: "SUCCESS" },
              error: { type: "object", nullable: true, example: null },
              success: {
                type: "object",
                properties: {
                  mission_id: { type: "number" },
                  title: { type: "string" },
                  reward_point: { type: "number" },
                  expire_at: { type: "string", format: "date-time" }
                }
              }
            }
          }
        }
      }
    }
    #swagger.responses[400] = {
      description: "가게 ID 없거나 잘못된 요청",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              resultType: { type: "string", example: "FAIL" },
              error: {
                type: "object",
                properties: {
                  errorCode: { type: "string", example: "M001" },
                  reason: { type: "string", example: "storeId 값이 존재하지 않습니다!" },
                  data: { type: "object", nullable: true }
                }
              },
              success: { type: "object", nullable: true, example: null }
            }
          }
        }
      }
    }
  */
  try {
    const storeId = Number(req.params.storeId);
    console.log(`Mission 요청 storeId: ${storeId}`);

    if (!storeId) {
      throw new NotFoundError("storeId 값이 존재하지 않습니다!");
    }

    const missionDTO = bodyToMission(req.body, storeId);
    const mission = await addMission(missionDTO);

    res.success(responseFromMission(mission));
    
  } catch (err) {
    next(err);
  }
};

// 특정 가게 미션 목록 조회
export const handleListStoreMissions = async (req, res, next) => {
  /*
    #swagger.summary = '특정 가게 미션 목록 조회 API'
    #swagger.description = '특정 가게의 미션 목록을 조회합니다. 페이징은 cursor 기반입니다.'
    #swagger.parameters['storeId'] = { description: '가게 ID', in: 'path', required: true, type: 'integer' }
    #swagger.parameters['cursor'] = { description: '마지막으로 조회한 미션 ID. 0이면 첫 페이지', in: 'query', required: false, type: 'integer' }
    #swagger.responses[200] = {
      description: "가게 미션 목록 조회 성공",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              resultType: { type: "string", example: "SUCCESS" },
              error: { type: "object", nullable: true, example: null },
              success: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    mission_id: { type: "number" },
                    title: { type: "string" },
                    reward_point: { type: "number" },
                    expire_at: { type: "string", format: "date-time" }
                  }
                }
              }
            }
          }
        }
      }
    }
    #swagger.responses[400] = {
      description: "가게 ID 없거나 잘못된 요청",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              resultType: { type: "string", example: "FAIL" },
              error: {
                type: "object",
                properties: {
                  errorCode: { type: "string", example: "M002" },
                  reason: { type: "string", example: "유효한 storeId 필요" },
                  data: { type: "object", nullable: true }
                }
              },
              success: { type: "object", nullable: true, example: null }
            }
          }
        }
      }
    }
  */
  try {
    const storeId = parseInt(req.params.storeId);
    const cursor = typeof req.query.cursor === "string" ? parseInt(req.query.cursor) : 0;

    const missions = await listStoreMissions(storeId, cursor);
    
    res.success(responseFromMissions(missions));
    
  } catch (err) {
    next(err);
  }
};
