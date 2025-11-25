//입력 DTO
export const bodyToUser = (body) => ({
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
export const responseFromUser = (user) => ({
  user_id: user.user_id,
  user_name: user.user_name,
  gender: user.gender,
  birthdate: user.birthdate,
  address: user.address,
  phone: user.phone,
  social_provider: user.social_provider,
  social_id: user.social_id,
  point_balance: user.point_balance,
});
