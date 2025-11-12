import { StatusCodes } from "http-status-codes";
import { challengeMission, listUserOngoingMissions, completeUserMission } from "../services/usermission.service.js";
import { RequestError } from "../errors/systemErrors.js";
import { bodyToUserMission} from "../dtos/usermission.dto.js";

export const handleChallengeMission = async (req, res, next) => {
  try {    
    const storeId = Number(req.params.storeId);
    const missionId = Number(req.params.missionId);
    const userId = req.body.user_id;
    console.log(`사용자 Mission 추가 요청 storeId: ${storeId}`);

    //dto 변환
    const userMissionDTO = bodyToUserMission(req.body, storeId, missionId);
    //비즈니스 로직을 호출
    const usermission = await challengeMission(userMissionDTO);

    res.status(StatusCodes.CREATED).json({
      isSuccess: true,
      code: StatusCodes.CREATED,
      message: "미션 도전이 성공적으로 등록되었습니다.",
      data: usermission,
    });
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
    res.status(StatusCodes.OK).json({
      isSuccess: true,
      code: StatusCodes.OK,
      message: "사용자 미션 목록 조회 성공",
      data: missions,
    });
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
    res.status(StatusCodes.OK).json({
      isSuccess: true,
      code: StatusCodes.OK,
      message: "미션 완료 처리 성공",
      data: updatedMission,
    });
  }catch(err){
    next(err);
  }
};
 