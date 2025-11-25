/*※입력값 유효성 검증을 여기서 하는 방향으로※*/
import { StatusCodes } from "http-status-codes"; 
import { addMission, listStoreMissions } from "../services/mission.service.js";
import { bodyToMission } from "../dtos/mission.dto.js";
import { CustomError } from "../errors/customError.js";
import { successHandler } from "../middlewares/successHandler.js";

export const handleAddMission = async (req, res, next) => {
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