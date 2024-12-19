import { useState, useEffect, useCallback } from 'react';
import { tokenService } from '../utils/token';
import { getNotifications, getPostDetail, getUserProfile, seenNotifications } from '../apis/apis';
import { Notification } from '../types/notification';

export const useNotification = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNoticeModal, setShowNoticeModal] = useState(false);
  const [followerNames, setFollowerNames] = useState<{ [key: string]: string }>({});
  const [toast, setToast] = useState<{ show: boolean; message: string }>({
    show: false,
    message: "",
  });

  const showToastMessage = useCallback((message: string) => {
    setToast({ show: true, message });
    setTimeout(() => setToast({ show: false, message: "" }), 5000);
  }, []);

  const fetchNotifications = useCallback(async () => {
    const currentToken = tokenService.getToken();
    if (!currentToken) {
      setNotifications([]);
      return;
    }
  
    try {
      const response = await getNotifications();
      console.log('원본 데이터 :', response);
  
      const formattedNotifications = await Promise.all(
        response
          .filter((notification: any) => !notification.seen)
          .map(async (notification: any) => {
            console.log('각 알림 데이터 :', notification);
            
            // 알림 타입 결정 로직 수정
            let type = "LIKE"; // 기본값을 LIKE로 설정
            if (notification.comment) type = "COMMENT";
            if (notification.follow) type = "FOLLOW";
            
            console.log('결정된 타입:', type);
  
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
  
            const formattedNotification = {
              type,
              userId: notification.author._id,
              postId: notification.post,
              postTitle,
              notificationTypeId: notification.comment?._id || notification.follow?._id || notification.like?._id,
              notificationId: notification._id,
              user: {
                fullName: notification.user.fullName,
              },
            };
  
            console.log('최종 형식', formattedNotification);
            return formattedNotification;
          })
      );
  
      setNotifications(formattedNotifications);
    } catch (error) {
      console.error("알림을 불러오는데 실패했습니다", error);
      setNotifications([]);
    }
  }, []);

  const fetchFollowerNames = useCallback(async () => {
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
  }, [notifications]);

  const handleAcceptFollow = useCallback(async (notification: Notification) => {
    try {
      await seenNotifications(notification.notificationId);
      showToastMessage(`${followerNames[notification.userId]}님과 친구가 되었습니다`);
      await fetchNotifications();
      return true;
    } catch (error) {
      showToastMessage("요청이 실패했습니다");
      return false;
    }
  }, [followerNames, showToastMessage, fetchNotifications]);

  const handleRejectFollow = useCallback(async (notification: Notification) => {
    try {
      await seenNotifications(notification.notificationId);
      await fetchNotifications();
      return true;
    } catch (error) {
      showToastMessage("요청이 실패했습니다");
      return false;
    }
  }, [fetchNotifications, showToastMessage]);

  const handleReadNotification = useCallback(async (notification: Notification) => {
    try {
      await seenNotifications(notification.notificationId);
      await fetchNotifications();
      return true;
    } catch (error) {
      showToastMessage("요청이 실패했습니다");
      return false;
    }
  }, [fetchNotifications, showToastMessage]);

  const handleMoveToPost = useCallback(async (notification: Notification) => {
    try {
      await seenNotifications(notification.notificationId);
      await fetchNotifications();
      return true;
    } catch (error) {
      showToastMessage("요청이 실패했습니다");
      return false;
    }
  }, [fetchNotifications, showToastMessage]);

  const closeModal = useCallback(() => {
    setShowNoticeModal(false);
  }, []);

  const toggleModal = useCallback(() => {
    setShowNoticeModal(prev => !prev);
  }, []);

  useEffect(() => {
    if (notifications.length > 0) {
      fetchFollowerNames();
    }
  }, [notifications, fetchFollowerNames]);

  // 모달이 열릴 때만 알림을 새로고침
  useEffect(() => {
    if (showNoticeModal) {
      fetchNotifications();
    }
  }, [showNoticeModal, fetchNotifications]);

  // 초기 마운트시 한 번만 알림을 가져옴
  useEffect(() => {
    const currentToken = tokenService.getToken();
    if (currentToken) {
      fetchNotifications();
    }
  }, [fetchNotifications]);

  return {
    notifications,
    showNoticeModal,
    setShowNoticeModal,
    followerNames,
    toast,
    handleAcceptFollow,
    handleRejectFollow,
    handleReadNotification,
    handleMoveToPost,
    closeModal,
    toggleModal
  };
};