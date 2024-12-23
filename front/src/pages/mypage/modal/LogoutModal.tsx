import { useState } from "react";
import NotificationModal from "../../../components/NotificationModal";
import axiosInstance from "../../../apis/axiosInstance";
import { useNavigate } from "react-router";

// 걍 로그아웃 버튼 누르면 notification modal 뜨게 만들면됨
// myPage에 들어갈 내용
const [isOpen, setIsOpen] = useState(false);
const navigate = useNavigate();

const handleLogout = async () => {
  try {
    await axiosInstance.post("/logout");
    navigate("/");
  } catch (error) {
    console.error(error);
  }
};

isOpen && (
  <NotificationModal isOpen={isOpen} title="알림" description="로그아웃 하시겠습니까?">
    <div>
      <button onClick={() => setIsOpen(false)}>취소</button>
      <button onClick={handleLogout}>확인</button>
    </div>
  </NotificationModal>
);
