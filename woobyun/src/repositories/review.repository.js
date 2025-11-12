import { prisma } from "../db.config.js";
import { NotFoundError, RequestError } from "../errors/systemErrors.js";

//가게 존재 여부 확인
export const isStoreExist = async (data) => {
  const store = await prisma.store.findFirst({
    where:{
      store_id: data.store_id
    }
  });
  if (!store){
    throw new NotFoundError(`해당 store_id: ${storeId}의 가게를 찾을 수 없습니다.`);
  }
  return store;
};

//리뷰 추가
export const addReviewToDB = async (data) => {
  //입력값이 누락이 되었는지 확인
  if(!data.rating || !data.content){
    throw new RequestError("리뷰 등록 시 별점과 내용은 필수입니다.");
  }
  const createdReview = await prisma.review.create({
    data:{
      store_id: data.store_id,
      user_id: data.user_id,
      rating: data.rating,
      content: data.content
    }
  });
  return createdReview;
};

//리뷰 목록 조회
export const getAllUserReviews = async (userId, cursor) => {
  const reviews = await prisma.review.findMany({
    select: {
      review_id: true,
      content: true,
      rating: true,
      created_at: true,
      store: {
        select: {
          store_id: true,
          store_name: true
        }
      }
    },
    where:{
      user_id: userId,
      review_id:{
        gt: cursor
      }
    },
    orderBy:{
      review_id: "asc"
    },
    take: 5
  });
  //사용자가 등록한 리뷰가 없는 경우
  if(!reviews || reviews.length == 0){
    throw new NotFoundError("사용자가 등록한 리뷰가 없습니다.");
  }
  return reviews;
};