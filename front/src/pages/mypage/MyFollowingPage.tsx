import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // navigate 훅 사용
import { getMyProfile, getUserProfile } from "../../apis/apis";
import unknownUserImg from "../../assets/user.png";
import loadingIconBlack from "../../assets/loading-icon-black.svg";
import AllUsersList from "../userinfo/AllUserList";
import Loading from "../../components/Loading";

const MyFollowingPage = () => {
  const navigate = useNavigate();
  const [following, setFollowing] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  const goToFollowingProfile = (following: any) => {
    const encodedFullName = encodeURIComponent(following.fullName);
    navigate(`/userinfo/${encodedFullName}`);
  };

  return (
    <div className="px-[30px] py-6">
      <h2 className="text-[16px] font-semibold font-pretendard mb-8  text-black dark:text-white">팔로잉</h2>
      {isLoading ? (
        <Loading />
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : following.length === 0 ? (
        <p className="text-black dark:text-white">팔로잉이 없습니다.</p>
      ) : (
        <ul>
          {following.map((following) => (
            <li key={following._id} className="mb-4 font-pretendard">
              <div
                className="flex items-center pb-4 mb-4 cursor-pointer"
                onClick={() => goToFollowingProfile(following)} // follower 객체를 전달
              >
                <img
                  src={following.image}
                  alt={following.fullName}
                  className="w-[40px] h-[40px] rounded-full object-cover"
                />
                <div className="flex flex-col justify-between ml-4">
                  <span className="text-[16px] font-semibold  text-black dark:text-white">{following.fullName}</span>
                  <span className="text-[14px] text-gray-300">{following.username}</span>
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

export default MyFollowingPage;
