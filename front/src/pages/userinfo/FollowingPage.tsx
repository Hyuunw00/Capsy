import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getUserProfile } from "../../apis/apis";

interface Following {
  userId: string;
}

interface UserProfile {
  fullName: string;
  username: string;
  image: string;
}

const FollowingPage = () => {
  const location = useLocation();
  const following: Following[] = location.state?.following || []; // ProfileHeader에서 전달된 following 배열

  const [profiles, setProfiles] = useState<UserProfile[]>([]);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const fetchedProfiles = await Promise.all(
          following.map(async (follow) => {
            const profile = await getUserProfile(follow.userId);
            return {
              fullName: profile.fullName,
              username: profile.username,
              image: profile.image,
            };
          }),
        );
        setProfiles(fetchedProfiles);
      } catch (error) {
        console.error("Failed to fetch following profiles:", error);
      }
    };

    fetchProfiles();
  }, [following]);

  return (
    <div className="p-4">
      <h1 className="text-lg font-semibold mb-4">팔로잉</h1>
      {profiles.length === 0 ? (
        <p>팔로잉을 불러오는 중...</p>
      ) : (
        <ul>
          {profiles.map((profile, index) => (
            <li key={index} className="flex items-center space-x-4 mb-2">
              <img src={profile.image} alt={profile.username} className="w-10 h-10 rounded-full object-cover" />
              <div>
                <p className="text-sm font-medium">{profile.fullName}</p>
                <p className="text-xs text-gray-500">@{profile.username}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FollowingPage;
