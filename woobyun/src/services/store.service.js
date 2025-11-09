import { addStoreToDB } from "../repositories/store.repository.js";
import { responseFromStore } from "../dtos/store.dto.js";

export const addStore = async (storeDTO) => {
  const createdStore = await addStoreToDB(storeDTO);

  return responseFromStore(createdStore);
};
