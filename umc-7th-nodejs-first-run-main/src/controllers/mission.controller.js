import { StatusCodes } from "http-status-codes"; 
import { addMission } from "../services/mission.service.js";
import { bodyToMission } from "../dtos/mission.dto.js";
import { listStoreMissions } from "../services/mission.service.js"

export const handleAddMission = async (req, res, next) => {
  try {
    const storeId = Number(req.params.storeId);
    console.log(`Mission 요청 storeId: ${storeId}`);

    if(!storeId) throw new NotFoundError("storeId 값이 존재하지 않습니다!");

    //dto 변환
    const missionDTO = bodyToMission(req.body, storeId);
    
    //비즈니스 로직을 호출
    const mission = await addMission(missionDTO);

    res.status(StatusCodes.CREATED).json({ result: mission });
  } catch (err) {//에러가 발생했을 때 실행되는 부분
    next(err);
  }
};

//특정 가게에서의 미션 조회
export const handleListStoreMissions = async(req, res, next) => {
  try {
    const storeId = parseInt(req.params.storeId);
    const cursor = typeof req.query.cursor === "string" ? parseInt(req.query.cursor): 0;

    const missions = await listStoreMissions(storeId, cursor);
    res.status(StatusCodes.OK).json(missions);
  }catch(err){
    next(err);
  }

};