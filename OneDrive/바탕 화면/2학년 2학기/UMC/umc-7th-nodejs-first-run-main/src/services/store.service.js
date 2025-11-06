import { addStoreToDB } from "../repositories/store.repository.js";
import { responseFromStore } from "../dtos/store.dto.js";
import { RequestError } from "../utils/systemErrors.js";


export const addStore = async (data) => {
const storeId = await addStoreToDB(data);
if (!storeId) throw new RequestError("가게를 추가하지 못했습니다.");
return responseFromStore({ id: storeId, ...data });
};