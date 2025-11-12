import { addStoreToDB } from "../repositories/store.repository.js";
import { responseFromStore } from "../dtos/store.dto.js";
import { RequestError } from "../errors/systemErrors.js";

export const addStore = async (storeDTO) => {
  const createdStore = await addStoreToDB(storeDTO);
  if (!createdStore) throw new RequestError("가게 등록에 실패했습니다.");

  return responseFromStore(createdStore);
};