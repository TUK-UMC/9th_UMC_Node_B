//입력 DTO
export const bodyToUserUpdate = (body) => ({
  user_name: body.user_name,
  gender: body.gender,
  birthdate: body.birthdate,
  address: body.address,
  phone: body.phone,
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