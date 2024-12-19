import { useEffect, useState } from "react";
import ProfileForm from "./modal/ProfileForm";
import ProfileImageForm from "./modal/ProfileImageForm";
import { tokenService } from "../../utils/token";
import { getMyProfile, uploadUserPhoto } from "../../apis/apis";
import { useNavigate } from "react-router-dom";
import Loading from "../../components/Loading"; // 로딩 컴포넌트
import userImg from "../../assets/user.png";

export default function ProfileHeader() {
  const navigate = useNavigate();

  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태 추가

  const [user, setUser] = useState<UserLists | null>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [username, setUsername] = useState("");

  const openProfileModal = () => setIsProfileModalOpen(true);
  const closeProfileModal = () => setIsProfileModalOpen(false);

  const openImageModal = () => setIsImageModalOpen(true);
  const closeImageModal = () => setIsImageModalOpen(false);

  const getUserInfo = async () => {
    try {
      const userData = await getMyProfile();
      setUser(userData);
      setProfileImage(userData.image || userImg);
      setUsername(userData.username || "");
      tokenService.setUser(userData);
    } catch (error) {
      console.error("Failed to fetch user info:", error);
    } finally {
      setIsLoading(false); // 데이터 로딩 후 로딩 상태 변경
    }
  };

  useEffect(() => {
    getUserInfo();
  }, []);

  const handleSaveImage = async (image: File) => {
    try {
      const response = await uploadUserPhoto(image);
      // console.log("Uploaded photo response:", response);
      const updatedUser = await getMyProfile();
      setUser(updatedUser);
      setProfileImage(updatedUser.image || null);
      tokenService.setUser(updatedUser);
    } catch (error) {
      console.error("Failed to update profile image:", error);
    } finally {
      closeImageModal();
    }
  };

  const handleShareProfile = async () => {
    const profileUrl = `/userinfo/${user?.fullName}`;

    try {
      await navigator.clipboard.writeText(profileUrl);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy: ", error);
    }
  };

  const handleUsernameUpdate = (newUsername: string) => {
    setUsername(newUsername);
  };

  const goToFollowersPage = () => {
    navigate(`/userinfo/${user?.fullName}/myfollower`, { state: { followers: user?.followers } });
  };

  const goToFollowingPage = () => {
    navigate(`/userinfo/${user?.fullName}/myfollowing`, { state: { following: user?.following } });
  };

  return (
    <div className="px-[30px] py-6 mb-[30px] font-pretendard">
      {isLoading ? ( // 로딩 중이면 Loading 화면 표시
        <Loading />
      ) : (
        <div className="flex flex-col">
          <h2 className="text-xl font-bold mb-[20px] text-[20px] text-black dark:text-white">@{user?.fullName}</h2>

          <div className="flex items-center justify-evenly">
            <div className="relative w-[90px] h-[90px]">
              <img
                src={profileImage || user?.image || ""}
                alt="Profile"
                className="object-cover w-full h-full rounded-full"
              />
              <svg
                onClick={openImageModal}
                className="absolute bottom-0 right-0 cursor-pointer z-2 w-[31px] h-[31px]"
                viewBox="0 0 31 31"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="15.1641" cy="15.2701" r="15" className="fill-primary dark:fill-primary-dark" />
                <path
                  d="M20.1641 14.2701H16.1641V10.2701C16.1641 10.0049 16.0587 9.75057 15.8712 9.56304C15.6836 9.3755 15.4293 9.27014 15.1641 9.27014C14.8988 9.27014 14.6445 9.3755 14.457 9.56304C14.2694 9.75057 14.1641 10.0049 14.1641 10.2701V14.2701H10.1641C9.89885 14.2701 9.64449 14.3755 9.45696 14.563C9.26942 14.7506 9.16406 15.0049 9.16406 15.2701C9.16406 15.5354 9.26942 15.7897 9.45696 15.9772C9.64449 16.1648 9.89885 16.2701 10.1641 16.2701H14.1641V20.2701C14.1641 20.5354 14.2694 20.7897 14.457 20.9772C14.6445 21.1648 14.8988 21.2701 15.1641 21.2701C15.4293 21.2701 15.6836 21.1648 15.8712 20.9772C16.0587 20.7897 16.1641 20.5354 16.1641 20.2701V16.2701H20.1641C20.4293 16.2701 20.6836 16.1648 20.8712 15.9772C21.0587 15.7897 21.1641 15.5354 21.1641 15.2701C21.1641 15.0049 21.0587 14.7506 20.8712 14.563C20.6836 14.3755 20.4293 14.2701 20.1641 14.2701Z"
                  className="fill-white dark:fill-black"
                />
              </svg>
            </div>

            <div className="flex flex-1 mt-4 text-center justify-evenly">
              <div className="flex flex-col items-center">
                <span className="font-semibold text-[14px] text-black dark:text-white">{user?.posts.length}</span>
                <span className="font-normal text-[14px] text-black dark:text-white">게시물</span>
              </div>
              <div className="flex flex-col items-center cursor-pointer" onClick={goToFollowersPage}>
                <span className="font-semibold text-[14px] text-black dark:text-white">{user?.followers.length}</span>
                <span className="font-normal text-[14px] text-black dark:text-white">팔로워</span>
              </div>
              <div className="flex flex-col items-center cursor-pointer" onClick={goToFollowingPage}>
                <span className="font-semibold text-[14px] text-black dark:text-white">{user?.following.length}</span>
                <span className="font-normal text-[14px] text-black dark:text-white">팔로잉</span>
              </div>
            </div>
          </div>

          <div className="mt-[20px]">
            <h3 className="text-[16px] font-regular text-black dark:text-white">{username}</h3> {/* username 표시 */}
          </div>

          <div className="flex space-x-[5px] mt-6">
            <button
              className="flex-1 py-3 text-white dark:text-black text-[16px] font-normal bg-primary dark:bg-secondary rounded-[5px]"
              onClick={openProfileModal}
            >
              프로필 편집
            </button>
            <button
              className="flex-1 py-3 text-white dark:text-black text-[16px] font-normal bg-primary dark:bg-secondary rounded-[5px]"
              onClick={handleShareProfile}
            >
              프로필 공유
            </button>
          </div>

          {isCopied && (
            <div className="mt-4 text-center text-primary dark:text-secondary font-pretendard font-regular">copied</div>
          )}
        </div>
      )}
      {isImageModalOpen && <ProfileImageForm onClose={closeImageModal} onSave={handleSaveImage} />}
      {isProfileModalOpen && <ProfileForm onClose={closeProfileModal} onUsernameUpdate={handleUsernameUpdate} />}{" "}
      {/* onUsernameUpdate 추가 */}
    </div>
  );
}
