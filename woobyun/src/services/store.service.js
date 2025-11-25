/*※DB 관련 에러처리 및 커스텀 에러 처리※*/
import { addStoreToDB } from "../repositories/store.repository.js";
import { responseFromStore } from "../dtos/store.dto.js";
import { ConflictError, InternalServerError } from "../errors/systemErrors.js";
import { findStoreByName } from "../repositories/store.repository.js"

export const addStore = async (storeDTO) => {
  //가게 중복 방지
  const existingStore = await findStoreByName(storeDTO.store_name);
  if (existingStore){
    throw new ConflictError("이미 등록된 가게 입니다.");
  }

  //가게 등록
  const createdStore = await addStoreToDB(storeDTO);
  if (!createdStore){ 
    throw new InternalServerError("가게 등록 실패");
  }
  
  //응답 데이터 반환 DTO
  return responseFromStore(createdStore);
};