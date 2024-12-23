import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Notification, NotifyModalProps } from "../../types/notification";
import Button from "../Button";
import { getPostDetail } from "../../apis/apis";
import { BlockModal } from "./BlockModal";

const NotifyModal = ({
  isVisible,
  notifications,
  followerNames,
  onAcceptFollow,
  onRejectFollow,
  onReadNotification,
  onMoveToPost,
  onClose,
}: NotifyModalProps & { onClose: () => void }) => {
  const navigate = useNavigate();
  const modalRef = useRef<HTMLDivElement>(null);
  const [showBlockModal, setShowBlockModal] = useState(false);

  const handleMoveToPost = async (notification: Notification) => {
    try {
      const postDetail = await getPostDetail(notification.postId);
      const parsedData = JSON.parse(postDetail.title);

      // closeAt이 있고 아직 공개되지 않은 경우
      if (parsedData.closeAt && new Date(parsedData.closeAt) > new Date()) {
        // alert 대신 모달 사용
        setShowBlockModal(true);
        onMoveToPost(notification); // 알림 읽음 처리
        return;
      }

      // 공개된 게시물인 경우
      if (notification.postId) {
        onMoveToPost(notification); // 알림 읽음 처리
        navigate(`/detail/${notification.postId}`);
      }
    } catch (error) {
      console.error("포스트 상세 정보 조회 실패:", error);
    }
  };

  const handleAcceptFollow = async (notification: Notification) => {
    try {
      await onAcceptFollow(notification);
      onClose();
      navigate(`/userinfo/${followerNames[notification.userId]}`);
    } catch (error) {
      console.error("팔로우 허용 실패", error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isVisible) {
      // 모달이 열려있을 때만 이벤트 리스너 추가
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      // 클린업 함수에서 이벤트 리스너 제거
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isVisible, onClose]);

  const renderNotification = (notification: Notification) => {
    const notificationKey = `${notification.type}-${notification.userId}-${notification.notificationTypeId}`;

    switch (notification.type) {
      case "FOLLOW":
        return (
          <div key={notificationKey} className="flex items-center justify-between py-2">
            <p className="dark:text-white">
              {followerNames[notification.userId] || notification.userId}님이 회원님을 팔로우했습니다.
            </p>
            <div className="flex gap-2">
              <Button
                onClick={() => onRejectFollow(notification)}
                className="px-2 py-0.5 h-7 items-center text-black rounded w-fit border border-black box-border text-sm
                 dark:bg-white dark:text-black hover:bg-gray-200 dark:hover:bg-gray-200"
              >
                확인
              </Button>
              <Button
                onClick={() => handleAcceptFollow(notification)}
                className="px-2 py-0.5 h-7 items-center text-white rounded w-fit bg-black text-sm hover:bg-gray-500 dark:hover:bg-gray-500"
              >
                이동
              </Button>
            </div>
          </div>
        );
      case "LIKE":
      case "COMMENT":
        return (
          <div key={notificationKey} className="flex items-center justify-between py-2 ">
            <p className="flex-1 mr-4 truncate dark:text-white">
              <strong className="max-w-[150px] truncate inline-block align-bottom">
                {notification.postTitle || "게시물"}
              </strong>
              에 새로운
              {notification.type === "LIKE" ? " 좋아요가" : " 댓글이"} 있습니다
            </p>
            <div className="flex gap-2 shrink-0">
              <Button
                onClick={() => onReadNotification(notification)}
                className="px-2 py-0.5 h-7 items-center text-black rounded w-fit border 
                border-black box-border text-sm dark:bg-white dark:text-black hover:bg-gray-200 dark:hover:bg-gray-200"
              >
                확인
              </Button>
              <Button
                onClick={() => handleMoveToPost(notification)}
                className="px-2 py-0.5 h-7 items-center text-white rounded w-fit bg-black text-sm hover:bg-gray-500 dark:hover:bg-gray-500"
              >
                이동
              </Button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <div
        ref={modalRef}
        className={`
          absolute top-[62px] left-8 shadow-md z-50 w-[90%] p-4 bg-white dark:bg-gray-600 rounded-lg
          transition-all duration-300 ease-in-out transform
          ${isVisible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0 pointer-events-none"}
        `}
      >
        {notifications?.length > 0 ? (
          notifications.map((notification) => renderNotification(notification))
        ) : (
          <p className="py-4 text-center text-gray-400 dark:text-gray-300">알림이 없습니다</p>
        )}
      </div>
  
      <BlockModal
        isOpen={showBlockModal} 
        onClose={() => {
          setShowBlockModal(false);
          navigate('/');
        }} 
      />
    </>
  );
};

export default NotifyModal;
