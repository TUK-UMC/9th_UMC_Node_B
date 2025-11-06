import { StatusCodes } from "http-status-codes";
import { challengeMission } from "../services/usermission.service.js";

export const handleChallengeMission = async (req, res) => {
  try {
    console.log("미션 도전 요청이 들어왔습니다!");
    console.log("params:", req.params);
    console.log("body:", req.body);

    const { storeId, missionId } = req.params;
    const { user_id } = req.body;

    const result = await challengeMission(Number(storeId), Number(missionId), Number(user_id));

    res.status(StatusCodes.OK).json({
      message: "미션 도전이 성공적으로 추가되었습니다!",
      result,
    });
  } catch (err) {
    console.error("Service Error:", err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "미션 도전 중 오류가 발생했습니다.",
      detail: err.message,
    });
  }
};