import { StatusCodes } from "http-status-codes";
import { bodyToStore } from "../dtos/store.dto.js";
import { addStore } from "../services/store.service.js";
import { RequestError } from "../errors/systemErrors.js";

export const handleAddStore = async (req, res, next) => {
  try {
    console.log("가게 추가 요청:", req.body);

    //가게 등록시 필수 내용 확인
    if(!req.body.name||!req.body.region_name||!req.body.address) throw new RequestError("name, region_name, adress는 필수 입니다.");

    const storeDTO = bodyToStore(req.body);
    
    const store = await addStore(storeDTO);

    res.status(StatusCodes.OK).json({ result: store });
  } catch (err) {//에러가 발생했을 때 실행되는 부분
    next(err);
  }
};
