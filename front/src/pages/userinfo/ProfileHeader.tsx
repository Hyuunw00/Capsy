import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // useParams 가져오기
import { tokenService } from "../../utils/token"; // 토큰 서비스
import { searchUsersByFullName } from "../../apis/apis"; // 사용자 검색 함수

interface User {
  fullName: string;
  username: string;
  image?: string;
  posts: { id: number; title: string }[]; // 게시물 목록
  followers: string[]; // 팔로워 목록
  following: string[]; // 팔로잉 목록
}

export default function ProfileHeader() {
  const [isCopied, setIsCopied] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  // URL에서 fullName을 추출
  const { fullname } = useParams<{ fullname: string }>(); // useParams로 fullName 가져오기

  useEffect(() => {
    if (!fullname) return;
    //(fullname)으로 불러와짐 ex.seul

    const getUserInfo = async () => {
      try {
        const userData = await searchUsersByFullName(fullname);
        setUser(userData);
        tokenService.setUser(userData);
      } catch (error) {
        console.error("사용자 정보를 가져오지 못했습니다:", error);
      }
    };

    getUserInfo();
  }, [fullname]);

  const handleShareProfile = async () => {
    const profileUrl = window.location.href;
    try {
      await navigator.clipboard.writeText(profileUrl);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error("URL 복사에 실패했습니다:", error);
    }
  };

  return (
    <div className="px-[30px] py-6 mb-[30px] font-pretendard">
      <div className="flex flex-col">
        <h2 className="text-xl font-semibold mb-[20px]">@{user?.fullName}</h2>
        <div className="flex items-center justify-evenly">
          <div className="relative w-[90px] h-[90px]">
            <img
              src={user?.image || "default-profile.png"}
              alt="Profile"
              className="w-full h-full rounded-full object-cover"
            />
          </div>

          <div className="flex flex-1 justify-evenly text-center mt-4">
            <div className="flex flex-col items-center">
              <span className="font-semibold text-[14px]">{user?.posts.length || 0}</span>
              <span className="font-normal text-[14px]">게시물</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-semibold text-[14px]">{user?.followers.length || 0}</span>
              <span className="font-normal text-[14px]">팔로워</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-semibold text-[14px]">{user?.following.length || 0}</span>
              <span className="font-normal text-[14px]">팔로잉</span>
            </div>
          </div>
        </div>
        <div className="mt-[20px]">
          <h3 className="text-[16px] font-regular">{user?.username || "Unknown User"}</h3>
        </div>
        <div className="flex space-x-[5px] mt-6">
          <button className="flex-1 py-3 text-white text-[16px] font-normal bg-primary rounded-[5px]">팔로우</button>
          <button
            className="flex-1 py-3 text-white text-[16px] font-normal bg-primary rounded-[5px]"
            onClick={handleShareProfile}
          >
            프로필 공유
          </button>
        </div>
        {isCopied && <div className="mt-4 text-primary font-pretendard font-regular text-center">Copied!</div>}
      </div>
    </div>
  );
}
