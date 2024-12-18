import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // navigate 훅 사용
import { getMyProfile, getUserProfile } from "../../apis/apis";
import unknownUserImg from "../../assets/user.png";
import AllUsersList from "../userinfo/AllUserList";
import Loading from "../../components/Loading";
import Follow from "../post/Follow";

const MyFollowingPage = () => {
  const navigate = useNavigate();
  const [following, setFollowing] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userData, setUserData] = useState(() => {
    const storedUserData = sessionStorage.getItem("user");
    return storedUserData ? JSON.parse(storedUserData) : { likes: [], following: [] };
  });

  const fetchFollowing = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const userData = await getMyProfile();
      console.log("User Data:", userData);

      const followingData = userData.following || [];

      const followingWithDetails = await Promise.all(
        followingData.map(async (followingItem: any) => {
          try {
            const followingId = followingItem.user;
            const followingProfile = await getUserProfile(followingId);
            return {
              _id: followingId,
              fullName: followingProfile.fullName || "Unknown",
              username: followingProfile.username || "",
              image: followingProfile.image || unknownUserImg,
            };
          } catch (error) {
            console.error("Failed to fetch following profile:", error);
            return {
              _id: followingItem.user || "Unknown",
              fullName: "Unknown",
              username: "",
              image: unknownUserImg, // 기본 이미지
            };
          }
        }),
      );

      setFollowing(followingWithDetails);
    } catch (err) {
      console.error("Failed to fetch following:", err);
      setError("팔로우 정보를 불러오는 데 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFollowing();
  }, []);

  const handleFollowUpdate = (updatedUserData: any) => {
    setUserData(updatedUserData);
    sessionStorage.setItem("user", JSON.stringify(updatedUserData));
  };

  const goToFollowingProfile = (following: any) => {
    const encodedFullName = encodeURIComponent(following.fullName);
    navigate(`/userinfo/${encodedFullName}`);
  };

  return (
    <div className="px-[30px] py-6">
      <h2 className="text-[16px] font-semibold font-pretendard mb-8 text-black dark:text-white">팔로잉</h2>
      {isLoading ? (
        <Loading />
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : following.length === 0 ? (
        <p>팔로잉하는 사용자가 없습니다.</p>
      ) : (
        <ul>
          {following.map((followingUser) => (
            <li key={followingUser._id} className="mb-4 font-pretendard">
              <div className="flex items-center justify-between pb-4 mb-4">
                <div className="flex items-center cursor-pointer" onClick={() => goToFollowingProfile(followingUser)}>
                  <img
                    src={followingUser.image}
                    alt={followingUser.fullName}
                    className="w-[40px] h-[40px] rounded-full object-cover"
                  />
                  <div className="flex flex-col justify-between ml-4">
                    <span className="text-[16px] font-semibold text-black dark:text-white">
                      {followingUser.fullName}
                    </span>
                    <span className="text-[14px] text-gray-300">{followingUser.username}</span>
                  </div>
                </div>

                <div className="ml-auto">
                  {userData._id !== followingUser._id && (
                    <Follow
                      userData={userData}
                      onFollowUpdate={handleFollowUpdate}
                      targetUserId={followingUser._id}
                      className="w-[80px] h-[30px] text-[14px] ml-4"
                    />
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
      <AllUsersList />
    </div>
  );
};

export default MyFollowingPage;
