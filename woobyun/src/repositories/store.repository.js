/*※웬만하면 에러 핸들링 사용하지 말것※*/
import { prisma } from "../db.config.js";

export const addStoreToDB = async (data) => {
  return prisma.store.create({
    data: {
      store_name: data.store_name,
      region_name: data.region_name,
      store_image_url: data.store_image_url || null,
      address: data.address,
      description: data.description || null,
    }
  });
};

//중복된 가게가 있는지 검사
export const findStoreByName = async (store_name) => {
  return prisma.store.findFirst({
    where: { store_name },
  });
};