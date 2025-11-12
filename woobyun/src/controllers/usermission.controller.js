import { StatusCodes } from "http-status-codes";
import { challengeMission } from "../services/usermission.service.js";
import { RequestError } from "../errors/systemErrors.js";
import { bodyToUserMission} from "../dtos/usermission.dto.js";
import { listUserOngoingMissions } from "../services/usermission.service.js";
import { completeUserMission } from "../services/usermission.service.js";

export const handleChallengeMission = async (req, res, next) => {
  try {
    console.log("미션 도전 요청:",req.body);
    
    const storeId = Number(req.params.storeId);
    const missionId = Number(req.params.missionId);
    const userId = req.body.user_id;
    
    if(!storeId || !missionId || !userId) throw new RequestError("storeId, missionId, userId는 필수 값입니다.");

    const userMissionDTO = bodyToUserMission(req.body, storeId, missionId);

    const usermission = await challengeMission(userMissionDTO);

    res.status(StatusCodes.CREATED).json({result: usermission});
  } catch (err) {//에러가 발생했을 때 실행되는 부분
    next(err);
  }
};

//진행 중인 미션 목록 조회
export const handleListUserOngoingMissions = async(req, res, next) => {
  try{
    const userId = parseInt(req.params.userId);
    const cursor = typeof req.query.cursor === "string" ? parseInt(req.query.cursor): 0;

    const missions = await listUserOngoingMissions(userId, cursor);
    res.status(StatusCodes.OK).json(missions);
  }catch(err){
    next(err);
  }
};

//진행 중인 미션 완료 처리하기
export const handleCompleteUserMissions = async ( req, res, next) => {
  try{
    const userId = parseInt(req.params.userId);
    const userMissionId = parseInt(req.params.userMissionId);

    const updatedMission = await completeUserMission(userId, userMissionId);
    res.status(200).json(updatedMission);
  }catch(err){
    next(err);
  }
};
 