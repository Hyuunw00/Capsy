import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { searchUsersByFullName, getUserProfile } from "../../apis/apis";
import { useNavigate } from "react-router-dom";
import { tokenService } from "../../utils/token";
import Follow from "../post/Follow";
import { getProfileImage } from '../../utils/profileImage'

interface UserProfile {
  _id: string;
  fullName: string;
  username: string;
  image: string;
  posts: string[];
  followers: string[];
  following: string[];
}

export default function UserInfoPage() {
  const { fullname } = useParams<{ fullname: string }>(); // URL에서 fullname 값 추출
  const [specificUserInfo, setSpecificUserInfo] = useState<UserProfile | null>(null); // 사용자 정보 상태
  const [error, setError] = useState<string | null>(null); // 에러 상태
  const navigate = useNavigate();
  const currentUser = tokenService.getUser();
  const [isCopied, setIsCopied] = useState(false);
  const [userData, setUserData] = useState(() => {
    const storedUserData = sessionStorage.getItem("user");
    return storedUserData ? JSON.parse(storedUserData) : { likes: [], following: [] };
  });

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

        // 사용자 ID로 상세 정보 가져오기
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
  }, [fullname, userData]);

  if (error) {
    return <div>{error}</div>;
  }

  // 사용자 정보가 없는 경우 처리
  if (!specificUserInfo) {
    return <div>사용자 정보를 찾을 수 없습니다.</div>;
  }

  // 팔로우 상태 업데이트 핸들러 추가
  const handleFollowUpdate = (updatedUserData: any) => {
    setUserData(updatedUserData);
    sessionStorage.setItem("user", JSON.stringify(updatedUserData));
  };

  const handleShareProfile = async () => {
    const profileUrl = `/userinfo/${specificUserInfo?.fullName}`;

    try {
      await navigator.clipboard.writeText(profileUrl);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy: ", error);
    }
  };

  const goToFollowersPage = () => {
    navigate(`/userinfo/${specificUserInfo?.fullName}/follower`, {
      state: { followers: specificUserInfo?.followers },
    });
  };

  const goToFollowingPage = () => {
    navigate(`/userinfo/${specificUserInfo?.fullName}/following`, {
      state: { following: specificUserInfo?.following },
    });
  };

  return (
    <div className="px-[30px] py-6 mb-[30px] font-pretendard">
      <div className="flex flex-col">
        <h2 className="text-xl font-bold mb-[20px] text-[20px] text-black dark:text-white">
          @{specificUserInfo?.fullName}
        </h2>

        <div className="flex items-center justify-evenly">
          <div className="relative w-[90px] h-[90px]">
            <img
              src={getProfileImage(specificUserInfo)}
              alt="Profile"
              className="object-cover w-full h-full rounded-full"
            />
          </div>

          <div className="flex flex-1 mt-4 text-center justify-evenly">
            <div className="flex flex-col items-center">
              <span className="font-semibold text-[14px] text-black dark:text-white">
                {specificUserInfo?.posts.length}
              </span>
              <span className="font-normal text-[14px] text-black dark:text-white">게시물</span>
            </div>
            <div className="flex flex-col items-center cursor-pointer" onClick={goToFollowersPage}>
              <span className="font-semibold text-[14px] text-black dark:text-white">
                {specificUserInfo?.followers.length}
              </span>
              <span className="font-normal text-[14px] text-black dark:text-white">팔로워</span>
            </div>
            <div className="flex flex-col items-center cursor-pointer" onClick={goToFollowingPage}>
              <span className="font-semibold text-[14px] text-black dark:text-white">
                {specificUserInfo?.following.length}
              </span>
              <span className="font-normal text-[14px] text-black dark:text-white">팔로잉</span>
            </div>
          </div>
        </div>

        <div className="mt-[20px]">
          <h3 className="text-[16px] font-regular text-black dark:text-white">{specificUserInfo?.username}</h3>
        </div>

        <div className="flex space-x-[5px] mt-6">
          {currentUser?._id === specificUserInfo._id ? (
            <button className="flex-1 py-3 text-white dark:text-black text-[16px] font-normal bg-primary dark:bg-secondary rounded-[5px]">
              프로필 수정
            </button>
          ) : (
            <div className="flex-1">
              <Follow
                userData={userData}
                onFollowUpdate={handleFollowUpdate}
                targetUserId={specificUserInfo._id}
                className="w-full py-3 text-[16px] font-normal rounded-[5px]"
              />
            </div>
          )}
          <button
            className="flex-1 py-3 text-white dark:text-black text-[16px] font-normal bg-primary dark:bg-secondary rounded-[5px]"
            onClick={handleShareProfile}
          >
            프로필 공유
          </button>
        </div>

        {isCopied && <div className="mt-4 text-center text-primary font-pretendard font-regular">copied</div>}
      </div>
    </div>
  );
}
