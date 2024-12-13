import { useState } from "react";
import axiosInstance from "../../apis/axiosInstance";
import NotificationModal from "../../components/NotificationModal";
import { useNavigate } from "react-router";
import { tokenService } from "../../utils/token";
import { useLoginStore } from "../../store/loginStore";

export default function Event() {
  // 로그아웃 기능구현을 위해 임시 저장(나중에 삭제)
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const logout = useLoginStore((state) => state.logout);

  const handleClcik = () => {
    setIsOpen(true);
  };

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
      {isOpen && (
        <NotificationModal isOpen={isOpen} title="알림" description="로그아웃 하시겠습니까?">
          <div>
            <button onClick={() => setIsOpen(false)}>취소</button>
            <button onClick={handleLogout}>확인</button>
          </div>
        </NotificationModal>
      )}
      <h1>Event</h1>
      <div>
        <button onClick={handleClcik}>logout</button>
      </div>
    </>
  );
}
