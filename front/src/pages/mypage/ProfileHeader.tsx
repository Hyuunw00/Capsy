import { useEffect, useState } from "react";
import profileImgEditIcon from "../../assets/profile-img-edit-icon.svg";
import ProfileForm from "./modal/ProfileForm";
import ProfileImageForm from "./modal/ProfileImageForm";
import { tokenService } from "../../utils/token";
import { getMyProfile, uploadUserPhoto } from "../../apis/apis";
import { useNavigate } from "react-router-dom";
import Loading from "../../components/Loading"; // 로딩 컴포넌트

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
      setProfileImage(userData.image || null);
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
              <label
                className="absolute bottom-0 right-0 cursor-pointer z-2"
                style={{ width: "30px", height: "30px" }}
                onClick={openImageModal}
              >
                <img src={profileImgEditIcon} alt="Edit Icon" className="w-full h-full" />
              </label>
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

          {isCopied && <div className="mt-4 text-center text-primary font-pretendard font-regular">copied</div>}
        </div>
      )}
      {isImageModalOpen && <ProfileImageForm onClose={closeImageModal} onSave={handleSaveImage} />}
      {isProfileModalOpen && <ProfileForm onClose={closeProfileModal} onUsernameUpdate={handleUsernameUpdate} />}{" "}
      {/* onUsernameUpdate 추가 */}
    </div>
  );
}
