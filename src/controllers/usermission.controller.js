import { StatusCodes } from "http-status-codes";
import { challengeMission, listUserOngoingMissions, completeUserMission } from "../services/usermission.service.js";
import { bodyToUserMission } from "../dtos/usermission.dto.js";
import { CustomError } from "../errors/customError.js";

/**
 * 유저 미션 도전 등록 API
 * @route POST /api/v1/stores/:storeId/missions/:missionId/challenge
 */
export const handleChallengeMission = async (req, res, next) => {
  /*
    #swagger.summary = '유저 미션 도전 등록 API'
    #swagger.parameters['storeId'] = { description: '도전할 가게 ID', required: true }
    #swagger.parameters['missionId'] = { description: '도전할 미션 ID', required: true }
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              userId: { type: "number", example: 1 }
            }
          }
        }
      }
    }
    #swagger.responses[201] = {
      description: "유저 미션 도전 등록 성공",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              resultType: { type: "string", example: "SUCCESS" },
              error: { type: "object", nullable: true, example: null },
              success: { type: "object" }
            }
          }
        }
      }
    }
    #swagger.responses[400] = {
      description: "유효하지 않은 storeId 또는 missionId",
      content: {
        "application/json": {
          schema: {
            resultType: { type: "string", example: "FAIL" },
            error: { type: "object", properties: { errorCode: { type: "string" }, reason: { type: "string" } } },
            success: { type: "object", nullable: true, example: null }
          }
        }
      }
    }
  */
  try {    
    const storeId = Number(req.params.storeId);
    const missionId = Number(req.params.missionId);

    if (!storeId || isNaN(storeId)) {
      throw new CustomError(StatusCodes.BAD_REQUEST, "유효한 storeId 필요");
    }
    if (!missionId || isNaN(missionId)) {
      throw new CustomError(StatusCodes.BAD_REQUEST, "유효한 missionId 필요");
    }

    const userMissionDTO = bodyToUserMission(req.body, storeId, missionId);
    const usermission = await challengeMission(userMissionDTO);

    return res.success({
      message: "유저 미션 도전 등록 성공",
      data: usermission
    });
  } catch (err) {
    next(err);
  }
};

/**
 * 사용자 진행 중인 미션 목록 조회 API
 * @route GET /api/v1/users/:userId/missions/ongoing
 */
export const handleListUserOngoingMissions = async (req, res, next) => {
  /*
    #swagger.summary = '사용자 진행 중인 미션 목록 조회 API'
    #swagger.parameters['userId'] = { description: '사용자 ID', required: true }
    #swagger.parameters['cursor'] = { description: '페이징 커서', required: false }
    #swagger.responses[200] = {
      description: "사용자 미션 목록 조회 성공",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              resultType: { type: "string", example: "SUCCESS" },
              error: { type: "object", nullable: true, example: null },
              success: { type: "array", items: { type: "object" } }
            }
          }
        }
      }
    }
    #swagger.responses[400] = {
      description: "유효하지 않은 userId 또는 cursor",
      content: {
        "application/json": {
          schema: {
            resultType: { type: "string", example: "FAIL" },
            error: { type: "object", properties: { errorCode: { type: "string" }, reason: { type: "string" } } },
            success: { type: "object", nullable: true, example: null }
          }
        }
      }
    }
  */
  try {
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

    return res.success({
      message: "사용자 미션 목록 조회 성공",
      data: usermissions
    });
  } catch (err) {
    next(err);
  }
};

/**
 * 진행 중인 미션 완료 처리 API
 * @route PATCH /api/v1/users/:userId/missions/:userMissionId/complete
 */
export const handleCompleteUserMissions = async (req, res, next) => {
  /*
    #swagger.summary = '진행 중인 미션 완료 처리 API'
    #swagger.parameters['userId'] = { description: '사용자 ID', required: true }
    #swagger.parameters['userMissionId'] = { description: '완료할 유저 미션 ID', required: true }
    #swagger.responses[200] = {
      description: "미션 완료 처리 성공",
      content: {
        "application/json": {
          schema: {
            resultType: { type: "string", example: "SUCCESS" },
            error: { type: "object", nullable: true, example: null },
            success: { type: "object" }
          }
        }
      }
    }
    #swagger.responses[400] = {
      description: "유효하지 않은 userMissionId",
      content: {
        "application/json": {
          schema: {
            resultType: { type: "string", example: "FAIL" },
            error: { type: "object", properties: { errorCode: { type: "string" }, reason: { type: "string" } } },
            success: { type: "object", nullable: true, example: null }
          }
        }
      }
    }
  */
  try {
    const userId = parseInt(req.params.userId);
    const userMissionId = parseInt(req.params.userMissionId);

    if (!userMissionId || isNaN(userMissionId)) {
      throw new CustomError(StatusCodes.BAD_REQUEST, "유효한 userMissionId가 필요합니다.");
    }

    const updatedMission = await completeUserMission(userId, userMissionId);

    return res.success({
      message: "미션 완료 처리 성공",
      data: updatedMission
    });
  } catch (err) {
    next(err);
  }
};
