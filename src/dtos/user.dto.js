// 입력 DTO - Postman body를 schema.prisma 형식으로 변환
export const bodyToUser = (body) => ({
  email: body.email,                    // ← 추가 (필수!)
  name: body.name,                      // ← user_name → name
  gender: body.gender,
  birth: body.birth,                    // ← birthdate → birth
  address: body.address,
  detailAddress: body.specAddress,      // ← specAddress → detailAddress
  phoneNumber: body.phone,              // ← phone → phoneNumber
});

// 출력 DTO - DB 데이터를 API 응답 형식으로 변환
export const responseFromUser = (user) => ({
  email: user.email,                    // ← 추가
  name: user.name,                      // ← user_name → name
  gender: user.gender,
  birth: user.birth,                    // ← birthdate → birth
  address: user.address,
  detailAddress: user.detailAddress,    // ← 추가
  phoneNumber: user.phoneNumber,        // ← phone → phoneNumber
});