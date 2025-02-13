export const getProfileImage = (user: any) => {
  return user?.image || '/user.png';
};

// 사용자(나)의 기본 이미지 설정에 사용할 때
// import { getProfileImage } from '(경로)/utils/profileImage'; // 유틸 함수 불러오기
// import { tokenService } from "../../utils/token"; // 토큰 유틸 함수 불러오기

//  const user = tokenService.getUser(); // 세션에서 유저 정보 가져오기
  
//   return (
//     <img 
//       src={getProfileImage(user)} // 함수에 유저 정보 전달
//       alt="프로필"
//     />
//   );