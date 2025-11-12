import { StatusCodes } from "http-status-codes"; 
import { addMission, listStoreMissions } from "../services/mission.service.js";
import { bodyToMission } from "../dtos/mission.dto.js";

export const handleAddMission = async (req, res, next) => {
  try {
    const storeId = Number(req.params.storeId);
    console.log(`Mission 추가 요청 storeId: ${storeId}`);
    //dto 변환
    const missionDTO = bodyToMission(req.body, storeId);
    //비즈니스 로직을 호출
    const mission = await addMission(missionDTO);
    
    
    res.status(StatusCodes.CREATED).json({
      isSuccess: true,
      code:StatusCodes.CREATED,
      message: "미션이 성공적으로 추가되었습니다.",
      data: mission,
    });
  } catch (err) { //에러가 발생시 에러 핸들러로 전달
    next(err);
  }
};

//특정 가게에서의 미션 조회
export const handleListStoreMissions = async(req, res, next) => {
  try {
    const storeId = parseInt(req.params.storeId);
    const cursor = typeof req.query.cursor === "string" ? parseInt(req.query.cursor): 0;

    const missions = await listStoreMissions(storeId, cursor);
    res.status(StatusCodes.OK).json({
      isSuccess: true,
      code:StatusCodes.OK,
      message: "가게 미션 목록 조회 성공",
      data: missions,
    });
  }catch(err){
    next(err);
  }
};
