import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // navigate 훅 사용
import { getMyProfile, getUserProfile } from "../../apis/apis";
import unknownUserImg from "../../assets/user.png";
import loadingIconBlack from "../../assets/loading-icon-black.svg";

const MyFollowerPage = () => {
  const navigate = useNavigate();
  const [followers, setFollowers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFollowers = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const userData = await getMyProfile();
      console.log("User Data:", userData);

      const followersData = userData.followers || [];

      const followersWithDetails = await Promise.all(
        followersData.map(async (followerItem: any) => {
          try {
            const followerId = followerItem.follower;
            const followerProfile = await getUserProfile(followerId);
            return {
              _id: followerId,
              fullName: followerProfile.fullName || "Unknown",
              username: followerProfile.username || "",
              image: followerProfile.image || unknownUserImg,
            };
          } catch (error) {
            console.error("Failed to fetch follower profile:", error);
            return {
              _id: followerItem.follower || "Unknown",
              fullName: "Unknown",
              username: "",
              image: unknownUserImg,
            };
          }
        }),
      );

      setFollowers(followersWithDetails);
    } catch (err) {
      console.error("Failed to fetch followers:", err);
      setError("팔로워 정보를 불러오는 데 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFollowers();
  }, []);

  const goToFollowerProfile = (follower: any) => {
    const encodedFullName = encodeURIComponent(follower.fullName);
    navigate(`/userinfo/${encodedFullName}`);
  };

  return (
    <div className="px-[30px] py-6">
      <h2 className="text-[16px] font-semibold font-pretendard mb-8  text-black dark:text-white">팔로워</h2>
      {isLoading ? (
        <div className="flex items-center justify-center h-screen">
          <img src={loadingIconBlack} alt="로딩 중" className="w-16 h-16" />
        </div>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : followers.length === 0 ? (
        <p>팔로워가 없습니다.</p>
      ) : (
        <ul>
          {followers.map((follower) => (
            <li key={follower._id} className="mb-4 font-pretendard">
              <div
                className="flex items-center pb-4 mb-4 cursor-pointer"
                onClick={() => goToFollowerProfile(follower)} // follower 객체를 전달
              >
                <img
                  src={follower.image}
                  alt={follower.fullName}
                  className="w-[40px] h-[40px] rounded-full object-cover"
                />
                <div className="flex flex-col justify-between ml-4">
                  <span className="text-[16px] font-semibold  text-black dark:text-white">{follower.fullName}</span>
                  <span className="text-[14px] text-gray-300">{follower.username}</span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyFollowerPage;
