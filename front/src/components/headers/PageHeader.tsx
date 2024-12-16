import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Left from "../../assets/Left.svg";
import logo_black from "../../assets/logo_black.svg";
import NotificationIcon from "../../assets/Notification.svg";
import NotifyModal from "./NotifyModal";
import { tokenService } from "../../utils/token";
import { followUser, getNotifications, getPostDetail, seenNotifications } from "../../apis/apis";
import { Notification } from "../../types/notification";
import LightMode from "../../assets/Light-mode.svg";
import DarkMode from "../../assets/Dark-mode.svg";
import { useThemeStore } from "../../store/themeStore";

export default function PageHeader() {
  const navigate = useNavigate();
  const [showNoticeModal, setShowNoticeModal] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [toast, setToast] = useState<{ show: boolean; message: string }>({
    show: false,
    message: "",
  });
  const [isLoggedIn, _] = useState<boolean>(!!tokenService.getToken());
  const { isDark, toggleTheme } = useThemeStore();

  const showToastMessage = (message: string) => {
    setToast({ show: true, message });
    setTimeout(() => setToast({ show: false, message: "" }), 5000);
  };

  const handleAcceptFollow = async (notification: Notification) => {
    try {
      await followUser(notification.userId);
      await seenNotifications(notification.notificationTypeId);
      showToastMessage(`${notification.userId}님과 친구가 되었습니다`);
      await fetchNotifications();
    } catch (error) {
      showToastMessage("요청이 실패했습니다");
    }
  };

  const handleRejectFollow = async (notification: Notification) => {
    try {
      await seenNotifications(notification.notificationTypeId);
      await fetchNotifications();
    } catch (error) {
      showToastMessage("요청이 실패했습니다");
    }
  };

  const handleReadNotification = async (notification: Notification) => {
    try {
      await seenNotifications(notification.notificationTypeId);
      await fetchNotifications();
    } catch (error) {
      showToastMessage("요청이 실패했습니다");
    }
  };

  const handleMoveToPost = async (notification: Notification) => {
    try {
      await seenNotifications(notification.notificationTypeId);
      await fetchNotifications();
    } catch (error) {
      showToastMessage("요청이 실패했습니다");
    }
  };

  const fetchNotifications = async () => {
    const currentToken = tokenService.getToken();
    if (!currentToken) {
      setNotifications([]);
      return;
    }

    try {
      const response = await getNotifications();
      const formattedNotifications = await Promise.all(
        response
          .filter((notification: any) => !notification.seen)
          .map(async (notification: any) => {
            let postTitle;
            if (notification.post) {
              try {
                const postDetail = await getPostDetail(notification.post);
                const parsedTitle = JSON.parse(postDetail.title);
                postTitle = parsedTitle.title;
              } catch (error) {
                postTitle = "삭제된 게시물";
              }
            }

            return {
              type: notification.comment ? "COMMENT" : notification.follow ? "FOLLOW" : "LIKE",
              userId: notification.author._id,
              postId: notification.post,
              postTitle,
              notificationTypeId: notification.comment?._id || notification.follow?._id || notification.like?._id,
              user: {
                fullName: notification.user.fullName,
              },
            };
          }),
      );
      setNotifications(formattedNotifications);
    } catch (error) {
      console.error("알림을 불러오는데 실패했습니다", error);
      setNotifications([]);
    }
  };

  useEffect(() => {
    const checkAndFetchNotifications = () => {
      const currentToken = tokenService.getToken();
      if (currentToken) {
        fetchNotifications();
      }
    };

    checkAndFetchNotifications();

    const interval = setInterval(checkAndFetchNotifications, 5000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <>
      <nav className="flex items-center justify-between px-8 py-4 bg-white dark:bg-black">
        <button
          onClick={() => {
            if (location.pathname === "/login") {
              navigate("/");
            } else {
              navigate(-1);
            }
          }}
          className="flex flex-col items-center"
        >
          <img src={Left} alt="Left" className="w-7 h-7 dark:invert" />
        </button>

        <button onClick={() => navigate('/')}>
          <img src={logo_black} alt="Logo" className="w-[75px] h-[30px] dark:invert" />
        </button>

        <div className="flex items-center gap-4">
          <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-600">
            <img
              src={isDark ? LightMode : DarkMode}
              alt={isDark ? "라이트모드 아이콘" : "다크모드 아이콘"}
              className="w-5 h-5"
            />
          </button>
          <button
            onClick={() => isLoggedIn && setShowNoticeModal((prev) => !prev)}
            className={`flex items-center justify-center w-5 h-5 relative ${
              !isLoggedIn ? "invisible pointer-events-none" : ""
            }`}
          >
            <img src={NotificationIcon} alt="Notification" className="object-contain w-full h-full dark:invert" />
            {notifications.length > 0 && (
              <div className="absolute w-2 h-2 rounded-full -top-1 -right-1 bg-secondary dark:bg-secondary-dark" />
            )}
          </button>
        </div>
      </nav>

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

      {toast.show && (
        <div className="fixed px-4 py-2 text-white transition-opacity bg-black rounded shadow-lg dark:bg-white dark:text-black top-4 right-4">
          {toast.message}
        </div>
      )}
    </>
  );
}
