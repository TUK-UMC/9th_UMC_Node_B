import { StatusCodes } from "http-status-codes";
import { challengeMission, listUserOngoingMissions, completeUserMission } from "../services/usermission.service.js";
import { RequestError } from "../errors/systemErrors.js";

export const handleChallengeMission = async (req, res, next) => {
  /*
    #swagger.summary = '미션 도전 등록 API';
    #swagger.parameters[0] = {
      in: "path",
      name: "prefix",
      required: true,
      description: "경로에 포함되는 접두사",
      schema: { type: "string" }
    };
    #swagger.parameters[1] = {
      in: "path",
      name: "storeId",
      required: true,
      description: "미션이 속한 상점의 ID",
      schema: { type: "string" }
    };
    #swagger.parameters[2] = {
      in: "path",
      name: "missionId",
      required: true,
      description: "도전할 미션의 ID",
      schema: { type: "string" }
    };
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
              success: { type: "boolean", example: true },
              message: { type: "string", example: "Challenge registered successfully" },
              data: {
                type: "object",
                properties: {
                  user_mission_id: { type: "number" },
                  mission_status: { type: "string", example: "in-progress" }
                }
              }
            }
          }
        }
      }
    };
    #swagger.responses[400] = {
      description: "잘못된 요청 (예: 필수 필드 누락)",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              success: { type: "boolean", example: false },
              error: { type: "string", example: "Missing required fields: user_id" }
            }
          }
        }
      }
    };
    #swagger.responses[404] = {
      description: "상점 또는 미션을 찾을 수 없음",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              success: { type: "boolean", example: false },
              error: { type: "string", example: "Store or mission not found" }
            }
          }
        }
      }
    };
    #swagger.responses[500] = {
      description: "서버 오류 (예: 데이터베이스 문제)",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              success: { type: "boolean", example: false },
              error: { type: "string", example: "Internal server error" }
            }
          }
        }
      }
    };
*/
  try {
    console.log("미션 도전 요청:", req.body);

    const storeId = Number(req.params.storeId);
    const missionId = Number(req.params.missionId);
    const userId = req.body.user_id;

    if (!storeId || !missionId || !userId) {
      throw new RequestError("storeId, missionId, userId는 필수 값입니다.");
    }

    const userMissionDTO = { user_id: userId, store_id: storeId, mission_id: missionId };
    const usermission = await challengeMission(userMissionDTO);

    res.status(StatusCodes.CREATED).json({
      success: true,
      message: "미션 도전 등록이 완료되었습니다.",
      data: usermission,
    });
  } catch (err) {
    next(err);
  }
};

export const handleListUserOngoingMissions = async (req, res, next) => {
  /*
    #swagger.summary = '사용자 미션 목록 조회 API';
    #swagger.parameters[0] = {
      in: "path",
      name: "prefix",
      required: true,
      description: "경로에 포함되는 접두사",
      schema: { type: "string" }
    };
    #swagger.parameters[1] = {
      in: "path",
      name: "userId",
      required: true,
      description: "미션을 조회할 사용자의 ID",
      schema: { type: "string" }
    };
    #swagger.parameters[2] = {
      in: "query",
      name: "cursor",
      required: false,
      description: "페이징을 위한 커서 값",
      schema: { type: "string" }
    };
    #swagger.responses[200] = {
      description: "사용자 미션 목록 조회 성공",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              success: { type: "boolean", example: true },
              data: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    mission_id: { type: "number" },
                    title: { type: "string" }
                  }
                }
              },
              pagination: {
                type: "object",
                properties: {
                  cursor: { type: "string", nullable: true }
                }
              }
            }
          }
        }
      }
    };
    #swagger.responses[400] = {
      description: "잘못된 요청 (예: 잘못된 사용자 ID 형식)",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              success: { type: "boolean", example: false },
              error: { type: "string", example: "Invalid userId format" }
            }
          }
        }
      }
    };
    #swagger.responses[404] = {
      description: "사용자 찾을 수 없음",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              success: { type: "boolean", example: false },
              error: { type: "string", example: "User not found" }
            }
          }
        }
      }
    };
    #swagger.responses[500] = {
      description: "서버 오류 (예: 데이터베이스 문제)",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              success: { type: "boolean", example: false },
              error: { type: "string", example: "Internal server error" }
            }
          }
        }
      }
    };
*/
  try {
    const userId = parseInt(req.params.userId);
    const cursor = typeof req.query.cursor === "string" ? parseInt(req.query.cursor) : 0;

    const missions = await listUserOngoingMissions(userId, cursor);
    res.status(StatusCodes.OK).json({
      success: true,
      message: "진행 중인 미션 목록 조회 성공",
      data: missions,
    });
  } catch (err) {
    next(err);
  }
};

export const handleCompleteUserMissions = async (req, res, next) => {
  /*
    #swagger.summary = '사용자 미션 완료 API';
    #swagger.parameters[0] = {
      in: "path",
      name: "prefix",
      required: true,
      description: "경로에 포함되는 접두사",
      schema: { type: "string" }
    };
    #swagger.parameters[1] = {
      in: "path",
      name: "userId",
      required: true,
      description: "미션을 완료할 사용자의 ID",
      schema: { type: "string" }
    };
    #swagger.parameters[2] = {
      in: "path",
      name: "userMissionId",
      required: true,
      description: "완료할 미션의 ID",
      schema: { type: "string" }
    };
    #swagger.responses[200] = {
      description: "미션 완료 성공",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              success: { type: "boolean", example: true },
              message: { type: "string", example: "Mission completed successfully" }
            }
          }
        }
      }
    };
    #swagger.responses[400] = {
      description: "잘못된 요청 (예: 잘못된 사용자 ID 형식)",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              success: { type: "boolean", example: false },
              error: { type: "string", example: "Invalid userId or userMissionId format" }
            }
          }
        }
      }
    };
    #swagger.responses[404] = {
      description: "사용자 또는 미션을 찾을 수 없음",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              success: { type: "boolean", example: false },
              error: { type: "string", example: "User or mission not found" }
            }
          }
        }
      }
    };
    #swagger.responses[500] = {
      description: "서버 오류 (예: 데이터베이스 문제)",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              success: { type: "boolean", example: false },
              error: { type: "string", example: "Internal server error" }
            }
          }
        }
      }
    };
*/
  try {
    const userId = parseInt(req.params.userId);
    const userMissionId = parseInt(req.params.userMissionId);

    const result = await completeUserMission(userId, userMissionId);
    res.status(StatusCodes.OK).json({
      success: true,
      message: result.message,
      data: result.result, // null or mission
    });
  } catch (err) {
    next(err);
  }
};