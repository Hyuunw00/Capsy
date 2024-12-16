import { useEffect } from "react";
import ProfileHeader from "./ProfileHeader";
import ProfileContainer from "./ProfileContainer";

export default function MyPage() {
  useEffect(() => {
    // 페이지 진입 시 스크롤을 맨 위로 이동
    window.scrollTo(0, 0);
  }, []); // 빈 배열을 의존성으로 전달

  return (
    <>
      <ProfileHeader />
      <ProfileContainer />
    </>
  );
}
