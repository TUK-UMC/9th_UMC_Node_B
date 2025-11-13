import { bodyToStore, responseFromStore } from "../dtos/store.dto.js";  // ← responseFromStore 추가
import { addStore } from "../services/store.service.js";
import { BadRequestError } from "../errors/systemErrors.js";

export const handleAddStore = async (req, res, next) => {
  try {
    console.log("가게 추가 요청:", req.body);

    // 필수 값 확인
    if (!req.body.store_name || !req.body.region_name || !req.body.address) {
      throw new BadRequestError("name, region_name, address는 필수입니다.");
    }

    const storeDTO = bodyToStore(req.body);
    const store = await addStore(storeDTO);

    // 표준 응답 형식 사용
    res.success(responseFromStore(store));
    
  } catch (err) {
    next(err);
  }
};