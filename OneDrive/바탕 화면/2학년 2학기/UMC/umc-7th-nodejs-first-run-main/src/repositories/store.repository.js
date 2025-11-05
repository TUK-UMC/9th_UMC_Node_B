import { prisma } from "../db.config.js";

export const addStoreToDB = async (data) => {
  const store = await prisma.store.create({
    data: {
      name: data.name,
      region_name: data.region_name,
      store_image_url: data.store_image_url,
      address: data.address,
      description: data.description,
    },
  });

  return store.store_id;
};