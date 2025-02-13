import { useState, useEffect } from "react";
import ProfileHeader from "./ProfileHeader";
import ProfileContainer from "./ProfileContainer";
import Loading from "../../components/Loading";

export default function MyPage() {
  const [isLoading, setIsLoading] = useState(true);

  // 데이터 로딩을 위한 함수 예시
  const loadData = async () => {
    // 예시로 ProfileHeader와 ProfileContainer의 데이터를 비동기적으로 로드
    try {
      // 여기서 데이터를 불러오는 API나 비동기 로직을 호출
      // 예: await fetchProfileData();
      // 이곳에서 비동기 데이터 로딩이 끝나면 로딩 상태 종료
    } catch (error) {
      console.error("데이터 로딩 중 오류 발생:", error);
    } finally {
      // 모든 데이터 로딩이 끝났을 때 isLoading을 false로 설정
      setIsLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    loadData(); // 데이터 로딩 시작
  }, []);

  return (
    <>
      {isLoading ? (
        <Loading /> // 데이터 로딩 중에는 로딩 화면 표시
      ) : (
        <>
          <ProfileHeader />
          <ProfileContainer />
        </>
      )}
    </>
  );
}
