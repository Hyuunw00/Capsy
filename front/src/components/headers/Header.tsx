import { useEffect, useState } from "react";
import logo_black from "../../assets/logo_black.svg";
import NotificationIcon from "../../assets/Notification.svg";
import NotifyModal from "./NotifyModal";
import { tokenService } from "../../utils/token";
import { followUser, getNotifications, seenNotifications } from "../../apis/apis";
import { Notification } from "../../types/notification";

export default function Header() {
  const [showNoticeModal, setShowNoticeModal] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [toast, setToast] = useState<{ show: boolean; message: string }>({
    show: false,
    message: ""
  });

  // 로그인 상태 변경 감지를 위한 state 추가
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(!!tokenService.getToken());

  const showToastMessage = (message: string) => {
    setToast({ show: true, message });
    setTimeout(() => setToast({ show: false, message: "" }), 5000);
  };

  const handleAcceptFollow = async (notification: Notification) => {
    try {
      await followUser(notification.userId);
      await seenNotifications();
      showToastMessage(`${notification.userId}님과 친구가 되었습니다`);
      await fetchNotifications();
    } catch (error) {
      showToastMessage("요청이 실패했습니다");
    }
  };

  const handleRejectFollow = async (notification: Notification) => {
    try {
      await seenNotifications();
      await fetchNotifications();
    } catch (error) {
      showToastMessage("요청이 실패했습니다");
    }
  };

  const handleReadNotification = async (notification: Notification) => {
    try {
      await seenNotifications();
      await fetchNotifications();
    } catch (error) {
      showToastMessage("요청이 실패했습니다");
    }
  };

  const handleMoveToPost = (notification: Notification) => {
    handleReadNotification(notification);
  };

  const fetchNotifications = async () => {
    const currentToken = tokenService.getToken();
    if (!currentToken) {
      setNotifications([]);
      return;
    }

    try {
      const response = await getNotifications();
      setNotifications(response);
    } catch (error) {
      console.error("알림을 불러오는데 실패했습니다", error);
      setNotifications([]);
    }
  };

  // 로그인 상태 변경 감지
  useEffect(() => {
    const checkLoginStatus = () => {
      const currentToken = tokenService.getToken();
      setIsLoggedIn(!!currentToken);
      if (currentToken) {
        fetchNotifications();
      } else {
        setShowNoticeModal(false);
        setNotifications([]);
      }
    };

    // 초기 상태 체크
    checkLoginStatus();

    // 로그인 상태 변경 감지를 위한 이벤트 리스너
    window.addEventListener('storage', checkLoginStatus);

    return () => {
      window.removeEventListener('storage', checkLoginStatus);
    };
  }, []);

  return (
    <>
      <nav className="flex items-center justify-between px-8 py-4">
        <img src={logo_black} alt="Logo" className="w-[75px] h-[30px]" />
        <button
          onClick={() => isLoggedIn && setShowNoticeModal((prev) => !prev)}
          className={`flex items-center justify-center w-5 h-5 ${
            !isLoggedIn ? "invisible pointer-events-none" : ""
          }`}
        >
          <img
            src={NotificationIcon}
            alt="Notification"
            className="object-contain w-full h-full"
          />
        </button>
        {isLoggedIn && (
          <NotifyModal
            isVisible={showNoticeModal}
            notifications={notifications}
            onAcceptFollow={handleAcceptFollow}
            onRejectFollow={handleRejectFollow}
            onReadNotification={handleReadNotification}
            onMoveToPost={handleMoveToPost}
          />
        )}
      </nav>
      {toast.show && (
        <div className="fixed p-4 text-white transition-opacity bg-black rounded shadow-lg top-4 right-4">
          {toast.message}
        </div>
      )}
    </>
  );
}