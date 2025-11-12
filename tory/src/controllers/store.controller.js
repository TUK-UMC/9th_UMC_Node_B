import { StatusCodes } from "http-status-codes";
import { bodyToStore } from "../dtos/store.dto.js";
import { addStore } from "../services/store.service.js";
import { RequestError } from "../errors/systemErrors.js";

export const handleAddStore = async (req, res, next) => {
  try {
    console.log("가게 추가 요청:", req.body);

    if (!req.body.store_name || !req.body.region_name || !req.body.address) {
      throw new RequestError("store_name, region_name, address는 필수 입니다.");
    }

    const storeDTO = bodyToStore(req.body);
    const store = await addStore(storeDTO);

    res.status(StatusCodes.CREATED).json({
      success: true,
      message: "가게가 성공적으로 등록되었습니다.",
      data: store,
    });
  } catch (err) {
    next(err);
  }
};