import { StatusCodes } from "http-status-codes";
import { bodyToStore } from "../dtos/store.dto.js";
import { addStore } from "../services/store.service.js";

export const handleAddStore = async (req, res, next) => {
  try {
    console.log("가게 추가 요청이 들어왔습니다!");
    console.log("body:", req.body);

    const store = await addStore(bodyToStore(req.body));

    res.status(StatusCodes.OK).json({ result: store });
  } catch (err) {
    console.error(err);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "가게 추가 중 오류가 발생했습니다.", detail: err.message });
  }
};
