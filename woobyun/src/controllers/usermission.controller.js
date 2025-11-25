/*※입력값 유효성 검증을 여기서 하는 방향으로※*/
import { StatusCodes } from "http-status-codes";
import { challengeMission, listUserOngoingMissions, completeUserMission } from "../services/usermission.service.js";
import { bodyToUserMission} from "../dtos/usermission.dto.js";
import { successHandler } from "../middlewares/successHandler.js";
import { CustomError } from "../errors/customError.js";

export const handleChallengeMission = async (req, res, next) => {
  try {    
    const storeId = Number(req.params.storeId);
    const missionId = Number(req.params.missionId);
    //jwt 가져오기
    const userId = req.body.user_id;

    //유효한 값 검증
    if (!storeId || isNaN(storeId)) {
      throw new CustomError(StatusCodes.BAD_REQUEST, "유효한 storeId 필요");
    }
    if (!missionId || isNaN(missionId)) {
      throw new CustomError(StatusCodes.BAD_REQUEST, "유효한 missionId 필요");
    }

    //dto 변환
    const userMissionDTO = bodyToUserMission(storeId, missionId, userId);
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
  try{
    const userId = req.params.userId;

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
  try{
    const userId = req.params.userId;
    const userMissionId = Number(req.params.userMissionId);
    
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
 