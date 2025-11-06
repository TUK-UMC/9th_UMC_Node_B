export const bodyToStore = (body) => {
  const now = new Date();
  return {
    name: body.name,
    region_name: body.region_name,
    store_image_url: body.store_image_url || "",
    address: body.address || "",
    description: body.description || "",
    created_at: now,
    updated_at: now,
  };
};

export const responseFromStore = (store) => ({
  store_id: store.id,
  name: store.name,
  region_name: store.region_name,
  address: store.address,
  description: store.description,
});