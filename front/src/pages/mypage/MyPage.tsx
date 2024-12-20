import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { tokenService } from "../../utils/token";
import { useLoginStore } from "../../store/loginStore";
import axiosInstance from "../../apis/axiosInstance";
import NotificationModal from "../../components/NotificationModal";
import ProfileHeader from "./ProfileHeader";
import ProfileContainer from "./ProfileContainer";
import Loading from "../../components/Loading";

export default function MyPage() {
  const [isLoading, setIsLoading] = useState(true);
  // 로그아웃 모달 상태
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const logout = useLoginStore((state) => state.logout);

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

  // 로그아웃 모달
  const handleClick = () => {
    setIsOpen(true);
  };

  // 로그아웃 처리
  const handleLogout = async () => {
    try {
      await axiosInstance.post("/logout");
      navigate("/");
      logout();
      tokenService.clearAll();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      {/* 로그아웃 확인 모달 */}
      {isOpen && (
        <NotificationModal isOpen={isOpen} title="알림" description="로그아웃 하시겠습니까?">
          <div className="gap-2 item-between">
            <button className="w-full h-10 border border-black rounded-md" onClick={() => setIsOpen(false)}>
              취소
            </button>
            <button className="w-full h-10 text-white bg-black rounded-md" onClick={handleLogout}>
              확인
            </button>
          </div>
        </NotificationModal>
      )}

      {isLoading ? (
        <Loading /> // 데이터 로딩 중에는 로딩 화면 표시
      ) : (
        <>
          <ProfileHeader />
          <ProfileContainer />
          <div className="flex justify-end px-8 py-4">
            <button className="text-sm text-gray-400 underline" onClick={handleClick}>
              로그아웃
            </button>
          </div>
        </>
      )}
    </>
  );
}
