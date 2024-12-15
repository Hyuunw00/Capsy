import { useState, useEffect } from "react";
import { getMyProfile, getUserProfile } from "../../apis/apis"; // getMyProfile, getUserProfile 가져오기

const FollowerPage = () => {
  const [followers, setFollowers] = useState<any[]>([]); // 팔로워 목록 상태
  const [allUsers, setAllUsers] = useState<any[]>([]); // 모든 사용자 목록 상태

  // 팔로워 목록을 가져오는 함수
  const fetchFollowers = async () => {
    try {
      const userData = await getMyProfile(); // 로그인한 사용자 정보 가져오기
      const followersData = userData.followers || []; // 팔로워 정보 가져오기

      // 팔로워의 fullName과 image를 가져오기 위해 getUserProfile을 사용
      const followersWithDetails = await Promise.all(
        followersData.map(async (follower: { _id: string }) => {
          try {
            const userProfile = await getUserProfile(follower._id); // 팔로워의 상세 정보 가져오기
            return {
              fullName: userProfile.fullName || "Unknown", // fullName을 가져옴
              username: userProfile.username || "Unknown", // username을 가져옴
              image: userProfile.image || "", // 이미지가 없으면 빈 문자열 반환
            };
          } catch (error) {
            console.error("Failed to fetch follower profile:", error);
            return {
              _id: follower._id,
              fullName: "Unknown",
              username: "Unknown",
              image: "", // 실패한 경우 빈 이미지 반환
            };
          }
        }),
      );

      setFollowers(followersWithDetails); // 팔로워 정보 상태 업데이트
    } catch (error) {
      console.error("Failed to fetch followers:", error);
    }
  };

  // 모든 사용자 정보를 가져오는 함수
  const fetchAllUsers = async () => {
    try {
      // 이미 모든 사용자의 정보는 getUserProfile을 통해 알 수 있으므로
      // getMyProfile을 통해 로그인된 사용자 이후의 다른 사용자를 가져오는 방법으로 구현
      const usersData = []; // 모든 사용자 정보를 담을 배열

      // 예시로 사용하는 방법: 모든 사용자의 아이디나 정보를 이미 알고 있다고 가정
      // 이 부분은 사용자 정보를 어떻게 받는지에 따라 수정 필요

      // 예시: getUserProfile을 통해 여러 사용자 정보를 가져와야 할 경우
      const totalUsers = 100; // 총 사용자 수를 예시로 100명으로 설정 (실제로는 API로 불러올 수 있음)
      for (let i = 1; i <= totalUsers; i++) {
        const userProfile = await getUserProfile(i.toString()); // 아이디는 예시로 숫자로 진행
        usersData.push({
          fullName: userProfile.fullName || "Unknown",
          username: userProfile.username || "Unknown",
          image: userProfile.image || "",
          _id: userProfile._id,
        });
      }

      // 랜덤 20명 선택
      const randomUsers = usersData.sort(() => 0.5 - Math.random()).slice(0, 20);

      setAllUsers(randomUsers); // 랜덤 20명 사용자 정보 상태 업데이트
    } catch (error) {
      console.error("Failed to fetch all users:", error);
    }
  };

  useEffect(() => {
    fetchFollowers(); // 컴포넌트 마운트 시 팔로워 정보 가져오기
    fetchAllUsers(); // 모든 사용자 정보 가져오기
  }, []);

  return (
    <div className="px-[30px] py-6">
      <h2 className="text-[16px] font-semibold font-pretendard mb-8">팔로워</h2>
      <div>
        {followers.length === 0 ? (
          <p>팔로워가 없습니다.</p>
        ) : (
          <ul>
            {followers.map((follower) => (
              <li key={follower._id} className="mb-4 font-pretendard">
                <div className="flex items-center pb-4 mb-4">
                  <img
                    src={follower.image || "/default-avatar.png"} // 기본 이미지 경로 설정
                    alt={follower.fullName}
                    className="w-[40px] h-[40px] rounded-full object-cover"
                  />
                  <div className="ml-4 flex flex-col justify-between">
                    <span className="text-[16px] font-semibold">{follower.fullName}</span> {/* fullName 출력 */}
                    <span className="text-[14px] text-gray-300">{follower.username}</span> {/* username 출력 */}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <h2 className="text-[16px] font-semibold font-pretendard mb-8 mt-10">모든 사용자</h2>
      <div>
        {allUsers.length === 0 ? (
          <p>사용자가 없습니다.</p>
        ) : (
          <ul>
            {allUsers.map((user) => (
              <li key={user._id} className="mb-4 font-pretendard">
                <div className="flex items-center pb-4 mb-4">
                  <img
                    src={user.image || "/default-avatar.png"} // 기본 이미지 경로 설정
                    alt={user.fullName}
                    className="w-[40px] h-[40px] rounded-full object-cover"
                  />
                  <div className="ml-4 flex flex-col justify-between">
                    <span className="text-[16px] font-semibold">{user.fullName}</span> {/* fullName 출력 */}
                    <span className="text-[14px] text-gray-300">{user.username}</span> {/* username 출력 */}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default FollowerPage;
