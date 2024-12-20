import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { tokenService } from '../utils/token';
import { getNotifications, getPostDetail, getUserProfile, seenNotifications } from '../apis/apis';
import { Notification } from '../types/notification';

export const useNotification = () => {
  const location = useLocation();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNoticeModal, setShowNoticeModal] = useState(false);
  const [followerNames, setFollowerNames] = useState<{ [key: string]: string }>({});
  const [toast, setToast] = useState<{ show: boolean; message: string }>({
    show: false,
    message: "",
  });

  // 토스트 메시지 표시 함수
  const showToastMessage = useCallback((message: string) => {
    setToast({ show: true, message });
    setTimeout(() => setToast({ show: false, message: "" }), 5000);
  }, []);

  // 알림 데이터 가져오는 함수
  const fetchNotifications = useCallback(async () => {
    const currentToken = tokenService.getToken();
    if (!currentToken) {
      setNotifications([]);
      return;
    }
  
    try {
      const response = await getNotifications();
      // console.log('원본 데이터 :', response);
  
      const formattedNotifications = await Promise.all(
        response
          .filter((notification: any) => !notification.seen)
          .map(async (notification: any) => {
            // console.log('각 알림 데이터 :', notification);
            
            // 알림 타입 결정 로직 수정
            let type = "LIKE"; // 기본값을 LIKE로 설정
            if (notification.comment) type = "COMMENT";
            if (notification.follow) type = "FOLLOW";
            
            // console.log('결정된 타입:', type);
  
            // 게시물 제목 가져오기
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
  
            // 알림 데이터 형식화
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
  
            // console.log('최종 형식', formattedNotification);
            return formattedNotification;
          })
      );
  
      setNotifications(formattedNotifications);
    } catch (error) {
      console.error("알림을 불러오는데 실패했습니다", error);
      setNotifications([]);
    }
  }, []);

  // 팔로워 이름 가져오는 함수
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

  // 팔로우 수락 처리
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

  // 팔로우 거절 처리
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

  // 알림 읽음 처리
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

  // 게시물로 이동 처리
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

  // 알림이 있을 때 팔로워 이름 가져오기
  useEffect(() => {
    if (notifications.length > 0) {
      fetchFollowerNames();
    }
  }, [notifications, fetchFollowerNames]);

  // 알림 갱신 로직 (조건)
  // 1. 페이지 이동 시 (location.pathname 변경)
  // 2. 모달 열릴 때 (showNoticeModal 변경)
  // 3. 컴포넌트 마운트 시 (초기 렌더링)
  useEffect(() => {
    const currentToken = tokenService.getToken();
    if (currentToken && (location.pathname || showNoticeModal)) {
      fetchNotifications();
    }
  }, [location.pathname, showNoticeModal, fetchNotifications]);

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