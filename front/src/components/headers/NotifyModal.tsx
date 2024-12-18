import { useNavigate } from "react-router-dom";
import { Notification, NotifyModalProps } from "../../types/notification";
import Button from "../Button";
import { getUserProfile } from "../../apis/apis";
import { useEffect, useState } from "react";

const NotifyModal = ({
  isVisible,
  notifications,
  followerNames,
  onAcceptFollow,
  onRejectFollow,
  onReadNotification,
  onMoveToPost,
}: NotifyModalProps) => {
  const navigate = useNavigate();

  const handleMoveToPost = (notification: Notification) => {
    if (notification.postId) {
      onMoveToPost(notification);
      navigate(`/detail/${notification.postId}`);
    }
  };

  const handleAcceptFollow = (notification: Notification) => {
    onAcceptFollow(notification);
    // 확인 버튼 클릭 시 해당 유저의 프로필 페이지로 이동
    navigate(`/userinfo/${followerNames[notification.userId]}`);
  };

  const renderNotification = (notification: Notification) => {
    // 각 알림 타입에 따른 고유한 키 생성
    const notificationKey = `${notification.type}-${notification.userId}-${notification.notificationTypeId}`;

    switch (notification.type) {
      case "FOLLOW":
        return (
          <div key={notificationKey} className="flex items-center justify-between py-2">
            <p>{followerNames[notification.userId] || notification.userId}님이 팔로우를 요청했습니다</p>{" "}
            <div className="flex gap-2">
              <Button
                onClick={() => onRejectFollow(notification)}
                className="px-2 py-0.5 h-7 items-center text-black rounded w-fit border border-black box-border text-sm"
              >
                거절
              </Button>
              <Button
                onClick={() => handleAcceptFollow(notification)}
                className="px-2 py-0.5 h-7 items-center text-white rounded w-fit bg-black text-sm"
              >
                확인
              </Button>
            </div>
          </div>
        );
      case "LIKE":
      case "COMMENT":
        return (
          <div key={notificationKey} className="flex items-center justify-between py-2 hover:bg-gray-50">
            {/* 텍스트 영역을 flex-1로 설정하고 오버플로우 처리 */}
            <p className="flex-1 mr-4 truncate">
              <strong className="max-w-[150px] truncate inline-block align-bottom">
                {notification.postTitle || "게시물"}
              </strong>
              에 새로운
              {notification.type === "LIKE" ? " 좋아요가" : " 댓글이"} 있습니다
            </p>
            {/* 버튼 영역을 고정 너비로 설정 */}
            <div className="flex gap-2 shrink-0">
              <Button
                onClick={() => onReadNotification(notification)}
                className="px-2 py-0.5 h-7 items-center text-black rounded w-fit border border-black box-border text-sm"
              >
                확인
              </Button>
              <Button
                onClick={() => handleMoveToPost(notification)}
                className="px-2 py-0.5 h-7 items-center text-white rounded w-fit bg-black text-sm"
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
    <div
      className={`
        absolute top-[62px] left-8 shadow-md z-50 w-[90%] p-4 bg-white rounded-lg
        transition-all duration-300 ease-in-out transform
        ${isVisible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0 pointer-events-none"}
      `}
    >
      {notifications?.length > 0 ? (
        notifications.map((notification) => renderNotification(notification))
      ) : (
        <p className="py-4 text-center text-gray-500">알림이 없습니다</p>
      )}
    </div>
  );
};

export default NotifyModal;
