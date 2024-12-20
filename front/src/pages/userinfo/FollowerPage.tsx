import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { searchUsersByFullName, getUserProfile } from "../../apis/apis";
import AllUsersList from "./AllUserList";
import Loading from "../../components/Loading";
import Follow from "../post/Follow";
import userImg from "../../assets/user.png";

interface UserProfile {
  _id: string;
  fullName: string;
  username: string;
  image: string;
  followers: string[];
}

const FollowerPage = () => {
  const { fullname } = useParams<{ fullname: string }>();
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [followers, setFollowers] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [userData, setUserData] = useState(() => {
    const storedUserData = sessionStorage.getItem("user");
    return storedUserData ? JSON.parse(storedUserData) : { likes: [], following: [] };
  });

  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      setError(null);

      if (!fullname) {
        setError("사용자의 fullName이 없습니다.");
        setIsLoading(false);
        return;
      }

      try {
        // fullname으로 사용자 검색
        const users = await searchUsersByFullName(fullname);
        if (!users || users.length === 0) {
          setError("사용자를 찾을 수 없습니다.");
          setIsLoading(false);
          return;
        }

        const user = users[0];

        console.log(user._id); // 9a4b

        // 사용자 정보 가져오기
        const userProfile = await getUserProfile(user._id);
        setCurrentUser(userProfile);
        console.log(userProfile.followers);

        // // 팔로워 목록 가져오기
        // const followersDetails = await Promise.all(
        //   userProfile.followers.map(async (followerId: string) => {
        //     try {
        //       const followerProfile = await getUserProfile(followerId);
        //       return followerProfile; //
        //     } catch (err) {
        //       console.error(`팔로워 정보 로드 실패: ${followerId}`, err);
        //       return null;
        //     }
        //   }),
        // );

        // // 팔로워 목록 가져오기
        // const followersDetails = await Promise.all(
        //   userProfile.followers.map(async (followerId: string) => {
        //     try {
        //       const followerProfile = await getUserProfile(followerId);
        //       return followerProfile; //
        //     } catch (err) {
        //       console.error(`팔로워 정보 로드 실패: ${followerId}`, err);
        //       return null;
        //     }
        //   }),
        // );
        // 팔로워 목록 가져오기
        const followersDetails = await Promise.all(
          userProfile.followers.map(async (followerObj: any) => {
            try {
              const followerProfile = await getUserProfile(followerObj.follower);
              return {
                _id: followerProfile._id,
                fullName: followerProfile.fullName,
                username: followerProfile.username,
                image: followerProfile.image || userImg,
              };
            } catch (err) {
              console.error(`팔로워 정보 로드 실패: ${followerObj.follower}`, err);
              return null;
            }
          }),
        );

        // 팔로워 목록 업데이트, null을 제거
        const validFollowers = followersDetails.filter(Boolean) as UserProfile[];
        setFollowers(validFollowers);
      } catch (err) {
        console.error(err);
        setError("팔로워 정보를 가져오는 데 실패했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [fullname]);

  const handleFollowerClick = (follower: UserProfile) => {
    navigate(`/userinfo/${follower.fullName}`); // 새 URL로 이동
  };

  const handleFollowUpdate = (updatedUserData: any) => {
    setUserData(updatedUserData);
    sessionStorage.setItem("user", JSON.stringify(updatedUserData));
  };

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!currentUser) {
    return <div>사용자 정보를 찾을 수 없습니다.</div>;
  }

  return (
    <div className="px-[30px] py-6">
      <h2 className="text-[16px] font-semibold font-pretendard mb-8 text-black dark:text-white">
        {currentUser.fullName}님의 팔로워
      </h2>
      {followers.length === 0 ? (
        <p>팔로워가 없습니다.</p>
      ) : (
        <ul>
          {followers.map((follower) => (
            <li key={follower._id} className="mb-4 font-pretendard">
              <div className="flex items-center justify-between pb-4 mb-4">
                <div className="flex items-center cursor-pointer" onClick={() => handleFollowerClick(follower)}>
                  <img
                    src={follower.image || ""}
                    alt={follower.fullName}
                    className="w-[40px] h-[40px] rounded-full object-cover"
                  />
                  <div className="flex flex-col justify-between ml-4">
                    <span className="text-[16px] font-semibold text-black dark:text-white">{follower.fullName}</span>
                    <span className="text-[14px] text-gray-300">{follower.username}</span>
                  </div>
                </div>

                <div className="ml-auto">
                  {userData._id !== follower._id && (
                    <Follow
                      userData={userData}
                      onFollowUpdate={handleFollowUpdate}
                      targetUserId={follower._id}
                      className="w-[80px] h-[30px] text-[14px] ml-4"
                    />
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* 팔로잉 목록 하단에 AllUserList 컴포넌트 추가 */}
      <AllUsersList />
    </div>
  );
};

export default FollowerPage;
