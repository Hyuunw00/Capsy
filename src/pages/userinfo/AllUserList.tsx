import { useState, useEffect } from "react";
import { getAllUsers, getUserProfile } from "../../apis/apis";
import unknownUserImg from "../../assets/user.png";
import { useNavigate } from "react-router-dom";
import Loading from "../../components/Loading";

interface UserProfile {
  _id: string;
  fullName: string;
  username: string;
  image: string;
}

const AllUsersList = () => {
  const [everyIds, setEveryIds] = useState<string[]>([]);
  const [allUsers, setAllUsers] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate(); // navigate 훅 사용

  const fetchAllUserIds = async () => {
    try {
      const users = await getAllUsers();
      const ids = users.map((user: any) => user._id);
      setEveryIds(ids);
    } catch (err) {
      console.error("Failed to fetch all user IDs:", err);
      setError("모든 사용자 ID를 불러오는 데 실패했습니다.");
    }
  };

  const fetchAllUsers = async () => {
    try {
      const userProfiles = await Promise.all(
        everyIds.map(async (id) => {
          try {
            const userProfile = await getUserProfile(id);
            return {
              _id: id,
              fullName: userProfile.fullName || "Unknown",
              username: userProfile.username || "",
              image: userProfile.image || unknownUserImg,
            };
          } catch (err) {
            console.error(`Failed to fetch profile for user ${id}:`, err);
            return {
              _id: id,
              fullName: "Unknown",
              username: "",
              image: unknownUserImg,
            };
          }
        }),
      );
      setAllUsers(userProfiles);
    } catch (err) {
      console.error("Failed to fetch all user profiles:", err);
      setError("모든 사용자 정보를 불러오는 데 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllUserIds();
  }, []);

  useEffect(() => {
    if (everyIds.length > 0) {
      fetchAllUsers();
    }
  }, [everyIds]);

  const handleUserClick = (user: UserProfile) => {
    navigate(`/userinfo/${user.fullName}`);
  };

  return (
    <div>
      <h2 className="text-[16px] font-semibold font-pretendard mt-10 mb-8 text-black dark:text-white">모든 사용자</h2>
      {isLoading ? (
        <Loading />
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : allUsers.length === 0 ? (
        <p className="text-black dark:text-white">모든 사용자가 없습니다.</p>
      ) : (
        <ul>
          {allUsers.map((user) => (
            <li key={user._id} className="mb-4 font-pretendard">
              <div className="flex items-center justify-between pb-4 mb-4">
                <div className="flex items-center cursor-pointer" onClick={() => handleUserClick(user)}>
                  <img src={user.image} alt={user.fullName} className="w-[40px] h-[40px] rounded-full object-cover" />
                  <div className="flex flex-col justify-between ml-4">
                    <span className="text-[16px] font-semibold text-black dark:text-white">{user.fullName}</span>
                    <span className="text-[14px] text-gray-300">{user.username}</span>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AllUsersList;
