//입력 DTO
export const bodyToUser = (body, ) => ({
  user_name: body.user_name,
  password: body.password,
  gender: body.gender,
  birthdate: body.birthdate,
  address: body.address,
  phone: body.phone,
  social_provider: body.social_provider,
  social_id: body.social_id,
  point_balance: body.point_balance || 0,
});

//출력 DTO
export const responseFromUser = (data) => ({
  user_id: data.user_id,
  user_name: data.user_name,
  gender: data.gender,
  birthdate: data.birthdate,
  address: data.address,
  phone: data.phone,
  social_provider: data.social_provider,
  point_balance: data.point_balance,
});
