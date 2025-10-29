import { StatusCodes } from "http-status-codes";
import { addMission } from "../services/mission.service.js";
import { bodyToMission } from "../dtos/mission.dto.js";

export const handleAddMission = async (req, res) => {
  try {
    console.log("미션 추가 요청이 들어왔습니다!");
    console.log("params:", req.params);
    console.log("body:", req.body);

    const storeId = Number(req.params.storeId);
    const mission = await addMission(storeId, bodyToMission(req.body));

    res.status(StatusCodes.OK).json({ result: mission });
  } catch (err) {
    console.error(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "미션 추가 중 오류가 발생했습니다.",
      detail: err.message,
    });
  }
};
