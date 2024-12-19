import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { tokenService } from "../../utils/token";
import { useNotification } from "../../hooks/useNotification";
import { useThemeStore } from "../../store/themeStore";
import NotifyModal from "./NotifyModal";

// Assets
import Left from "../../assets/Left.svg";
import logo_black from "../../assets/logo_black.svg";
import NotificationIcon from "../../assets/Notification.svg";
import LightMode from "../../assets/Light-mode.svg";
import DarkMode from "../../assets/Dark-mode.svg";

export default function PageHeader() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(!!tokenService.getToken());
  const { isDark, toggleTheme } = useThemeStore();

  const {
    notifications,
    showNoticeModal,
    followerNames,
    toast,
    handleAcceptFollow,
    handleRejectFollow,
    handleReadNotification,
    handleMoveToPost,
    closeModal,
    toggleModal
  } = useNotification();

  // 뒤로가기 핸들러
  const handleBack = () => {
    if (location.pathname === "/login") {
      navigate("/");
      return;
    }

    if (location.pathname.startsWith("/detail/")) {
      const { fromEditor } = location.state || {};
      if (fromEditor) {
        navigate("/");
        return;
      }
    }

    navigate(-1);
  };

  // 로그인 상태 변경 감지
  useEffect(() => {
    const checkLoginStatus = () => {
      const currentToken = tokenService.getToken();
      setIsLoggedIn(!!currentToken);
      if (!currentToken) {
        closeModal();
      }
    };

    // 초기 상태 체크
    checkLoginStatus();

    // 로그인 상태 변경 감지를 위한 이벤트 리스너
    window.addEventListener("storage", checkLoginStatus);

    return () => {
      window.removeEventListener("storage", checkLoginStatus);
    };
  }, [closeModal]);

  return (
    <>
      <nav className="absolute top-0 z-20 justify-between w-full px-8 py-4 bg-white dark:bg-black item-between">
        <button onClick={handleBack} className="flex flex-col items-center">
          <img src={Left} alt="Left" className="w-7 h-7 dark:invert" />
        </button>

        <button onClick={() => navigate("/")}>
          <img src={logo_black} alt="Logo" className="w-[75px] h-[30px] dark:invert" />
        </button>

        <div className="flex items-center gap-2">
          <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-600">
            <img
              src={isDark ? LightMode : DarkMode}
              alt={isDark ? "라이트모드 아이콘" : "다크모드 아이콘"}
              className="w-5 h-5"
            />
          </button>

          {isLoggedIn && (
            <button
              onClick={toggleModal}
              className="relative flex items-center justify-center w-5 h-5"
            >
              <img src={NotificationIcon} alt="Notification" className="object-contain w-full h-full dark:invert" />
              {notifications.length > 0 && (
                <div className="absolute w-2 h-2 rounded-full -top-1 -right-1 bg-secondary" />
              )}
            </button>
          )}
        </div>
      </nav>

      {isLoggedIn && (
        <NotifyModal
          isVisible={showNoticeModal}
          notifications={notifications}
          followerNames={followerNames}
          onAcceptFollow={handleAcceptFollow}
          onRejectFollow={handleRejectFollow}
          onReadNotification={handleReadNotification}
          onMoveToPost={handleMoveToPost}
          onClose={closeModal}
        />
      )}

      {/* Toast 메시지 */}
      {toast.show && (
        <div className="fixed px-4 py-2 text-white transition-opacity bg-black rounded shadow-lg dark:bg-white dark:text-black top-4 right-4">
          {toast.message}
        </div>
      )}
    </>
  );
}