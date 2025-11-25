/*※입력값 유효성 검증을 여기서 하는 방향으로※*/
import { StatusCodes } from "http-status-codes";
import { bodyToStore } from "../dtos/store.dto.js";
import { addStore } from "../services/store.service.js";
import { NotFoundError } from "../errors/systemErrors.js";
import { successHandler } from "../middlewares/successHandler.js";

export const handleAddStore = async (req, res, next) => {
  try {
    //입력값 유효성 검증
    const {store_name, region_name, address} = req.body;
    if(!store_name || store_name.trim().length === 0){
      throw new NotFoundError(StatusCodes.BAD_REQUEST, "store_name 입력 필요");
    }
    if(!region_name || region_name.trim().length === 0){
      throw new NotFoundError(StatusCodes.BAD_REQUEST, "region_name 입력 필요");
    }
    if(!address || address.trim().length === 0){
      throw new NotFoundError(StatusCodes.BAD_REQUEST, "address 입력 필요");
    }

    //DTO 변환
    const storeDTO = bodyToStore(req.body);
    const store = await addStore(storeDTO);

    return successHandler(
      res, 
      StatusCodes.CREATED, 
      `store_id: ${store.store_id} 가게 등록 성공`, 
      store
    );
  } catch (err) {//에러가 발생했을 때 실행되는 부분
    next(err);
  }
};
