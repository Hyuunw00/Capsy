import { useState, useEffect } from "react";
import axiosInstance from "../../apis/axiosInstance";
import { createNotifications } from "../../apis/apis";

// 필수 타입 정의
interface FollowData {
  _id: string;
  user: string;
  follower: string;
  createdAt: string;
  updatedAt: string;
}

interface Props {
  userData: {
    _id: string;
    following: FollowData[];
  };
  onFollowUpdate: (updatedUserData: any) => void;
  targetUserId: string;
  className?: string;
}

export default function Follow({ userData, onFollowUpdate, targetUserId, className = "" }: Props) {
  const [followStatus, setFollowStatus] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    const isFollowing = userData.following.some((follow: FollowData) => follow.user === targetUserId);
    setFollowStatus({ [targetUserId]: isFollowing });
  }, [targetUserId, userData.following]);

  const handleFollowClick = async (targetUserId: string) => {
    try {
      const isFollowing = userData.following.some((follow: FollowData) => follow.user === targetUserId);

      if (!isFollowing) {
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

        await createNotifications({
          notificationType: "FOLLOW",
          notificationTypeId: response.data._id,
          userId: targetUserId,
          postId: null,
        });

        const updatedUserData = {
          ...userData,
          following: [...userData.following, newFollow],
        };
        onFollowUpdate(updatedUserData);
        setFollowStatus((prevState) => ({ ...prevState, [targetUserId]: true }));
      } else {
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
        onFollowUpdate(updatedUserData);
        setFollowStatus((prevState) => ({ ...prevState, [targetUserId]: false }));
      }
    } catch (error) {
      console.error("팔로우 처리 중 오류 발생:", error);
    }
  };

  return (
    <button
      className={`
        ${followStatus[targetUserId] ? "bg-black dark:bg-gray-50" : "bg-primary dark:bg-secondary"}
        text-white dark:text-black rounded transition-colors
        ${className}
      `.trim()}
      onClick={() => handleFollowClick(targetUserId)}
    >
      {followStatus[targetUserId] ? "팔로잉" : "팔로우"}
    </button>
  );
}
