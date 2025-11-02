/*
1. 처음 실행이 되는지 확인하기 위해서 문자열들을 공백으로 허용하는 것은 좋지만 만약 필수 데이터라면 이 부분은 지워주셔야 된다.
-> 대신 catch문이 필요하겠지요?(이미 컨트롤러에서 잡는중)
*/

export const bodyToStore = (body) => ({
  name: body.name,
  region_name: body.region_name,
  store_image_url: body.store_image_url,
  address: body.address,
  description: body.description,
  created_at: body.created_at,
  updated_at: body.updated_at,
});

export const responseFromStore = (store) => ({
  store_id: store.id,
  name: store.name,
  region_name: store.region_name,
  store_image_url: store.store_image_url,
  address: store.address,
  description: store.description,
});
