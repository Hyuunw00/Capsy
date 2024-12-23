import { useState, useEffect } from "react";
import { searchUsersByFullName, getUserProfile } from "../apis/apis";

// UserProfile 타입 정의
interface UserProfile {
  _id: string;
  fullName: string;
  username: string;
  image: string;
  posts: string[];
  followers: string[];
  following: string[];
}

// 커스텀 훅 정의
export const useUserProfile = (fullname: string) => {
  const [specificUserInfo, setSpecificUserInfo] = useState<UserProfile | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!fullname) {
        setError("사용자의 fullName이 없습니다.");
        return;
      }

      try {
        const users = await searchUsersByFullName(fullname);

        if (!users || users.length === 0) {
          setError("사용자를 찾을 수 없습니다.");
          return;
        }

        const user = users[0];
        const userProfile = await getUserProfile(user._id);
        setSpecificUserInfo(userProfile);
      } catch (err) {
        console.error(err);
        setError("사용자 정보를 가져오는 데 실패했습니다.");
      }
    };

    if (fullname) {
      fetchUserData();
    }
  }, [fullname]);

  return { specificUserInfo, error };
};
