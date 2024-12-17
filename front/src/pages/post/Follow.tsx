import { useEffect, useState } from "react";
import axiosInstance from "../../apis/axiosInstance";
import { createNotifications } from "../../apis/apis";

export default function Follow({ userData, onFollowUpdate, targetUserId }: Props) {
  const [followStatus, setFollowStatus] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    const isFollowing = userData.following.some((follow: FollowData) => follow.user === targetUserId);
    setFollowStatus({ [targetUserId]: isFollowing });
  }, [targetUserId, userData.following]);

  const handleFollowClick = async (targetUserId: string) => {
    try {
      const isFollowing = userData.following.some((follow: FollowData) => follow.user === targetUserId);

      if (!isFollowing) {
        // 팔로우 추가
        const response = await axiosInstance.post("/follow/create", {
          userId: targetUserId,
        });

        const newFollow: FollowData = {
          _id: response.data._id,
          user: response.data.user,
          follower: response.data.follower,
          createdAt: response.data.createdAt,
          updatedAt: response.data.updatedAt,
        };

        // 팔로우 알림 생성
        await createNotifications({
          notificationType: "FOLLOW",
          notificationTypeId: response.data._id, // 팔로우 데이터 ID
          userId: targetUserId, // 팔로우 받는 사용자 ID
          postId: null,
        });

        const updatedUserData = {
          ...userData,
          following: [...userData.following, newFollow],
        };
        onFollowUpdate?.(updatedUserData);
        setFollowStatus((prevState) => ({ ...prevState, [targetUserId]: true }));
      } else {
        // 팔로우 취소 - 엔드포인트 수정
        const followData = userData.following.find((follow: FollowData) => follow.user === targetUserId);

        if (!followData) {
          throw new Error("팔로우 데이터를 찾을 수 없습니다.");
        }

        await axiosInstance.delete("/follow/delete", {
          data: { id: followData._id },
        });

        const updatedUserData = {
          ...userData,
          following: userData.following.filter((follow: FollowData) => follow._id !== followData._id),
        };
        onFollowUpdate?.(updatedUserData);
        setFollowStatus((prevState) => ({ ...prevState, [targetUserId]: false }));
      }
    } catch (error) {
      console.error("팔로우 처리 중 오류 발생:", error);
    }
  };
  return (
    <button
      className={`${
        followStatus[targetUserId] ? "bg-black" : "bg-primary"
      } text-white rounded px-4 py-1 transition-colors text-sm`}
      onClick={() => handleFollowClick(targetUserId)}
    >
      {followStatus[targetUserId] ? "팔로잉" : "팔로우"}
    </button>
  );
}
