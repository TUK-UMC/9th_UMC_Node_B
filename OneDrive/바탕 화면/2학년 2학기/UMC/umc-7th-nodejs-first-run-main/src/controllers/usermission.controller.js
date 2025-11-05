import { StatusCodes } from "http-status-codes";
import { challengeMission } from "../services/usermission.service.js";
import { RequestError } from "../errors/systemErrors.js";
import { bodyToUserMission} from "../dtos/usermission.dto.js";

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