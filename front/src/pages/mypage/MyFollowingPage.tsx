import { useState, useEffect } from "react";
import { getMyProfile, getUserProfile } from "../../apis/apis";
import unknownUserImg from "../../assets/user.png";
import loadingIconBlack from "../../assets/loading-icon-black.svg";

const MyFollowingPage = () => {
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

  return (
    <div className="px-[30px] py-6">
      <h2 className="text-[16px] font-semibold font-pretendard mb-8">팔로잉</h2>
      {isLoading ? (
        <div className="flex justify-center items-center h-screen">
          <img src={loadingIconBlack} alt="로딩 중" className="w-16 h-16" />
        </div>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : following.length === 0 ? (
        <p>팔로잉이 없습니다.</p>
      ) : (
        <ul>
          {following.map((user) => (
            <li key={user._id} className="mb-4 font-pretendard">
              <div className="flex items-center pb-4 mb-4">
                <img src={user.image} alt={user.fullName} className="w-[40px] h-[40px] rounded-full object-cover" />
                <div className="ml-4 flex flex-col justify-between">
                  <span className="text-[16px] font-semibold">{user.fullName}</span>
                  <span className="text-[14px] text-gray-300">{user.username}</span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyFollowingPage;
