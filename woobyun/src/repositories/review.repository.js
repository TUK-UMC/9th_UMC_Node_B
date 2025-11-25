/*※웬만하면 에러 핸들링 사용하지 말것※*/
import { prisma } from "../db.config.js";

//가게 존재 여부 확인
export const isStoreExist = async (data) => {
  return prisma.store.findFirst({
    where:{
      store_id: data.store_id
    }
  });
};

//리뷰 추가
export const addReviewToDB = async (data) => {
  return prisma.review.create({
    data:{
      store_id: data.store_id,
      user_id: data.user_id,
      rating: data.rating,
      content: data.content
    }
  });
};

//리뷰 목록 조회
export const getAllUserReviews = async (userId, cursor) => {
  return prisma.review.findMany({
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
};