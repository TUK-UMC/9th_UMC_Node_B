import { addStoreToDB } from "../repositories/store.repository.js";
import { responseFromStore } from "../dtos/store.dto.js";

export const addStore = async (data) => {
  try {
    const storeId = await addStoreToDB(data);

    if (!storeId) throw new Error("가게를 추가하지 못했습니다.");

    return responseFromStore({ id: storeId, ...data });
  } catch (err) {
    console.error("❌ Service Error:", err);
    throw err;
  }
};
