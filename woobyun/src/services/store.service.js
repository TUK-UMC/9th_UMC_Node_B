import { addStoreToDB } from "../repositories/store.repository.js";
import { responseFromStore } from "../dtos/store.dto.js";

export const addStore = async (storeDTO) => {
  const storeId = await addStoreToDB(storeDTO);

  return responseFromStore({ store_id: storeId, ...storeDTO});
};
