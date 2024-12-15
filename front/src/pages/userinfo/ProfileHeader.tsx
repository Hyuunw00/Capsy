import { useEffect, useState } from "react";
import { tokenService } from "../../utils/token";
import { getUserProfile } from "../../apis/apis";

interface User {
  fullName: string;
  username: string;
  image?: string;
  posts: { id: number; title: string }[];
  followers: string[];
  following: string[];
}

export default function ProfileHeader() {
  const [fullName, setFullName] = useState<string>("");
  const [isCopied, setIsCopied] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const path = window.location.pathname;
    const extractedFullName = path.split("/")[2]; //
    setFullName(extractedFullName || "");
  }, []); //풀네임 가져와짐

  useEffect(() => {
    const getUserInfo = async () => {
      if (!fullName) return;

      try {
        const userData = await getUserProfile(fullName);
        setUser(userData);
        tokenService.setUser(userData);
      } catch (error) {
        console.error("사용자 정보를 가져오지 못했습니다:", error);
      }
    };

    getUserInfo();
  }, [fullName]);

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
