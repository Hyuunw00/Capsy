import { useEffect, useState } from "react";
import logo_black from "../../assets/logo_black.svg";
import NotificationIcon from "../../assets/Notification.svg";
import NotifyModal from "./NotifyModal";
import { tokenService } from "../../utils/token";
import { followUser, getNotifications, getPostDetail, getUserProfile, seenNotifications } from "../../apis/apis";
import { Notification } from "../../types/notification";
import LightMode from "../../assets/Light-mode.svg";
import DarkMode from "../../assets/Dark-mode.svg";
import { useThemeStore } from "../../store/themeStore";
import { useNavigate } from "react-router";

export default function Header() {
  const [showNoticeModal, setShowNoticeModal] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [toast, setToast] = useState<{ show: boolean; message: string }>({
    show: false,
    message: "",
  });
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(!!tokenService.getToken());
  const { isDark, toggleTheme } = useThemeStore();
  const [followerNames, setFollowerNames] = useState<{ [key: string]: string }>({});
  const navigate = useNavigate();

  const showToastMessage = (message: string) => {
    setToast({ show: true, message });
    setTimeout(() => setToast({ show: false, message: "" }), 5000);
  };

  useEffect(() => {
    const fetchFollowerNames = async () => {
      const names: { [key: string]: string } = {};

      for (const notification of notifications) {
        if (notification.type === "FOLLOW") {
          try {
            const userProfile = await getUserProfile(notification.userId);
            names[notification.userId] = userProfile.fullName;
          } catch (error) {
            console.error("Failed to fetch user profile:", error);
          }
        }
      }

      setFollowerNames(names);
    };

    if (notifications.length > 0) {
      fetchFollowerNames();
    }
  }, [notifications]);

  const handleAcceptFollow = async (notification: Notification) => {
    try {
      await seenNotifications(notification.notificationId); // notificationId로 수정
      showToastMessage(`${followerNames[notification.userId]}님과 친구가 되었습니다`);
      await fetchNotifications();
      navigate(`/userinfo/${followerNames[notification.userId]}`);
    } catch (error) {
      showToastMessage("요청이 실패했습니다");
    }
  };

  const handleRejectFollow = async (notification: Notification) => {
    try {
      // 팔로우 거절 시 해당 알림만 읽음 처리
      await seenNotifications(notification.notificationId); // notificationId로 수정
      await fetchNotifications();
    } catch (error) {
      showToastMessage("요청이 실패했습니다");
    }
  };

  const handleReadNotification = async (notification: Notification) => {
    try {
      // 특정 알림만 읽음 처리
      await seenNotifications(notification.notificationId); // notificationId로 수정
      await fetchNotifications();
    } catch (error) {
      showToastMessage("요청이 실패했습니다");
    }
  };

  const handleMoveToPost = async (notification: Notification) => {
    try {
      // 포스트로 이동하기 전 해당 알림 읽음 처리
      await seenNotifications(notification.notificationId); // notificationId로 수정
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
              notificationTypeId: notification.follow ? notification.follow._id : (notification.comment?._id || notification.like?._id),  // FOLLOW 타입일 때는 follow._id 사용
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

    // 5초마다 새로운 알림이나 seen 상태 변경을 체크
    const interval = setInterval(checkAndFetchNotifications, 5000);

    return () => {
      clearInterval(interval);
    };
  }, []);

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
    window.addEventListener("storage", checkLoginStatus);

    return () => {
      window.removeEventListener("storage", checkLoginStatus);
    };
  }, []);

  return (
    <>
      <nav className="absolute top-0 z-20 justify-between w-full px-8 py-4 bg-white dark:bg-black item-between">
        <img src={logo_black} alt="Logo" className="w-[75px] h-[30px] dark:invert" />

        <div className="flex items-center gap-2">
          <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-600">
            <img
              src={isDark ? LightMode : DarkMode}
              alt={isDark ? "라이트모드 아이콘" : "다크모드 아이콘"}
              className="w-5 h-5"
            />
          </button>
          <button
            onClick={() => isLoggedIn && setShowNoticeModal((prev) => !prev)}
            className={`flex items-center justify-center w-5 h-5 relative ${!isLoggedIn ? "hidden" : ""}`}
          >
            <img src={NotificationIcon} alt="Notification" className="object-contain w-full h-full dark:invert" />
            {notifications.length > 0 && <div className="absolute w-2 h-2 rounded-full -top-1 -right-1 bg-secondary" />}
          </button>
        </div>

        {isLoggedIn && (
          <NotifyModal
            isVisible={showNoticeModal}
            notifications={notifications}
            followerNames={followerNames}
            onAcceptFollow={handleAcceptFollow}
            onRejectFollow={handleRejectFollow}
            onReadNotification={handleReadNotification}
            onMoveToPost={handleMoveToPost}
          />
        )}
      </nav>
      {toast.show && (
        <div className="fixed px-4 py-2 text-white transition-opacity bg-black rounded shadow-lg dark:bg-white dark:text-black top-4 right-4">
          {toast.message}
        </div>
      )}
    </>
  );
}
