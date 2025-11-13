import { prisma } from "../db.config.js";
import { RequestError } from "../errors/systemErrors.js";

export const addStoreToDB = async (data) => {
  //가게 등록시 필수 값 확인
  if(!data.store_name||!data.region_name||!data.address){ 
    throw new RequestError("name, region_name, address는 필수 입니다.");
  }
  const createdStore = await prisma.store.create({
    data: {
      store_name: data.store_name,
      region_name: data.region_name,
      store_image_url: data.store_image_url || null,
      address: data.address,
      description: data.description || null,
    }
  });

  return createdStore;
};

//중복된 가게가 있는지 검사
export const findStoreByName = async (store_name) => {
  return await prisma.store.findFirst({
    where: { store_name },
  });
};