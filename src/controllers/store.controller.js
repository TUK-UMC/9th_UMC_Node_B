import { StatusCodes } from "http-status-codes";
import { bodyToStore } from "../dtos/store.dto.js";
import { storeRegister } from "../services/store.service.js";

export const handleStoreRegister = async (req, res, next) => {
  console.log("가게 추가를 요청했습니다!");
  console.log("body:", req.body);

  const store = await storeRegister(bodyToStore(req.body));
  res.status(StatusCodes.CREATED).json({ result: store });
};