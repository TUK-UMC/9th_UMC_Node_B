import { addReviewToDB, isStoreExist } from "../repositories/review.repository.js";
import { responseFromReview } from "../dtos/review.dto.js";
import { NotFoundError, RequestError } from "../utils/systemErrors.js";


export const addReview = async (storeId, data) => {
const storeExists = await isStoreExist(storeId);
if (!storeExists) throw new NotFoundError(`store_id ${storeId}에 해당하는 가게가 존재하지 않습니다.`);


const reviewId = await addReviewToDB(storeId, data);
if (!reviewId) throw new RequestError("리뷰 등록에 실패했습니다.");


return responseFromReview({ id: reviewId, store_id: storeId, ...data });
};