
export const bodyToStore = (body) => ({
  store_name: body.store_name,
  region_name: body.region_name,
  store_image_url: body.store_image_url || null,
  address: body.address,
  description: body.description || null,
});

export const responseFromStore = (store) => ({
  store_id: store.store_id,
  store_name: store.store_name,
  region_name: store.region_name,
  store_image_url: store.store_image_url,
  address: store.address,
  description: store.description,
  created_at: store.created_at,
  updated_at: store.updated_at
}
);