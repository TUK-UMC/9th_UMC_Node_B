import { StatusCodes } from "http-status-codes";
import { bodyToStore } from "../dtos/store.dto.js";
import { addStore } from "../services/store.service.js";

export const handleAddStore = async (req, res, next) => {
  try {
    console.log("가게 추가 요청:", req.body);
    
    //DTO 변환
    const storeDTO = bodyToStore(req.body);
    const store = await addStore(storeDTO);

    res.status(StatusCodes.CREATED).json({
      isSuccess: true,
      code: StatusCodes.CREATED,
      message: `store_id: ${store.store_id} 가게 등록 성공`,
      data: store,                             
    });
  } catch (err) {//에러가 발생했을 때 실행되는 부분
    next(err);
  }
};
