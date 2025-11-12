import { prisma } from "../db.config.js";
//가게 존재 여부 확인
export const isStoreExist = async (data) => {
  const store = await prisma.store.findUnique({
    where:{
      store_id: data.store_id
    }
  });
  return !!store //존재하면 ture!!
};

//리뷰 추가
export const addReviewToDB = async (data) => {
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
  const limit = 5;

  const reviews = await prisma.review.findMany({
    where: {
      user_id: userId,
      ...(cursor && {
        review_id: { gt: cursor }
      })
    },
    orderBy: { review_id: 'asc' },
    take: limit + 1,
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
    }
  });

  const hasNextPage = reviews.length > limit;
  const data = reviews.slice(0, limit);
  const nextCursor = hasNextPage ? data[data.length - 1].review_id : null;

  return {
    data,
    pagination: {
      cursor: nextCursor
    }
  };
};