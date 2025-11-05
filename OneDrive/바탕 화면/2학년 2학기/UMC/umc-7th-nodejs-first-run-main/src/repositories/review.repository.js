import { prisma } from "../db.config.js";

export const isStoreExist = async (data) => {
  const store = await prisma.store.findUnique({
    where: { store_id: data.store_id },
  });
  return !!store;
};

export const addReviewToDB = async (data) => {
  const review = await prisma.review.create({
    data: {
      store_id: data.store_id,
      user_id: data.user_id,
      rating: data.rating,
      content: data.content,
    },
  });

  return review.review_id;
};