/*
1. const storeId = Number(req.parans.storeId); -> 값이 필수로 존재해야 하기 때문에 존재하는지 확인하는 로직이 있으면 좋음
  -> if (!storeId) throw new NotFoundError("값이 존재하지 않습니다.");
  -> 참고로 NotFoundError는 커스텀으로 만들거나 기본 Error 객체를 import 해야 한다.

2. bodyToMission 값 안에 storeId를 넣도록 하는 게 유지보수에 더 좋음
  -> bodyToMission 인자로 StoreId를 받으면 된다
  -> const mission = addMission(bodyToMission(req.body, storeId)); 이렇게
  ->Js에서는 매개 변수에 타입 지정이 안되어있기 때문에 순서를 꼭 지켜주셔야 한다

3. 요청이 들어올 때 값들이 여러개 라면 이 또한 DTO로 관리해 주면 좋다
-> 3개 이상부터 DTO를 만들어 주는 타입이다.

4. 만약 여기서 catch 문에 에러메시지를 작성한다면 레포지토리나 서비스 로직에서 전달되는 에러 메시지가 덮어 씌여지게 된다.
-> 이러면 정확한 오류를 알 수 없기 때문에 이 부분은 next로 넘기거나 throw 하도록 설정해야 한다.

5. 로그 같은건 디버깅이 끝났다면 지워주는 편이 좋다
  -> 아니면 콘솔에 너무 많이 찍혀서 저장공간 관리하기 조금 귀찮고 나중에 배포하고 동작하는거 확인할 때 불편하다.
  -> 요청값 확인 할 때 형변환 이후에 log를 찍어주셔야  제대로 확인 가능하다.
*/

import { StatusCodes } from "http-status-codes"; //HTTP 응답 상태 코드를 상수로 가져다 쓰기 위해 사용
//addMission 함수에 인자를 넘길 때 bodyToMission DTO를 이용해서 요청 데이터를 한 번 변환하여 전달
import { addMission } from "../services/mission.service.js";
import { bodyToMission } from "../dtos/mission.dto.js";

//async, await를 사용한 비동기 방식 사용
//req -> HTTP 요청 데이터
//res -> 응답을 보내는 객체
export const handleAddMission = async (req, res, next) => {
  try {//에러가 발생할 수 있는 부분
    const storeId = Number(req.params.storeId);

    console.log(`Mission 요청 storeId: ${storeId}`);

    //storeId의 존재 여부를 확인
    if(!storeId) throw new NotFoundError("storeId 값이 존재하지 않습니다!");

    //dto 변환
    const missionDTO = bodyToMission(req.body, storeId);
    
    //비즈니스 로직을 호출
    const mission = await addMission(missionDTO);

    res.status(StatusCodes.OK).json({ result: mission });
  } catch (err) {//에러가 발생했을 때 실행되는 부분
    next(err);
  }
};
