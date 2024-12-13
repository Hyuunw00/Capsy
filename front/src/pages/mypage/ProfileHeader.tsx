import { useEffect, useState } from "react";
import profileImgEditIcon from "../../assets/profile-img-edit-icon.svg";
import ProfileForm from "./modal/ProfileForm";

export default function ProfileHeader() {
  const username = "@caapsy_human";
  const posts = 19;
  const followers = 99;
  const following = 99;
  const nickname = "캡시햄찌";

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

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
    }
  };

  useEffect(() => {
    getUserInfo();
  }, []);

  const handleSaveImage = async (image: File) => {
    try {
      const response = await uploadUserPhoto(image);
      console.log("Uploaded photo response:", response);
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

  const getUserInfo = async () => {
    const data = await getMyProfile();
    setUser(data);
  };

  useEffect(() => {
    getUserInfo();
  }, []);

  const handleShareProfile = async () => {
    const profileUrl = `https://mywebsite.com/${username}`;

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

  return (
    <div className="px-[30px] py-6 mb-[30px] font-pretendard">
      <div className="flex flex-col">
        {/* 유저 이름 */}
        <h2 className="text-xl font-semibold mb-[20px]">{username}</h2>

        <div className="flex items-center justify-evenly">
          <div className="relative w-[90px] h-[90px]">
            <img
              src={profileImage || user?.image || ""}
              alt="Profile"
              className="w-full h-full rounded-full object-cover"
            />
            <label
              className="absolute bottom-0 right-0 cursor-pointer z-10"
              style={{ width: "30px", height: "30px" }}
              onClick={openImageModal}
            >
              <img src={profileImgEditIcon} alt="Edit Icon" className="w-full h-full" />
            </label>
          </div>

          <div className="flex flex-1 justify-evenly text-center mt-4">
            <div className="flex flex-col items-center">
              <span className="font-semibold text-[14px]">{user?.posts.length}</span>
              <span className="font-normal text-[14px]">게시물</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-semibold text-[14px]">{user?.followers.length}</span>
              <span className="font-normal text-[14px]">팔로워</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-semibold text-[14px]">{user?.following.length}</span>
              <span className="font-normal text-[14px]">팔로잉</span>
            </div>
          </div>
        </div>

        <div className="mt-[20px]">
          <h3 className="text-[14px] font-regular">{nickname}</h3>
        </div>

        <div className="flex space-x-[5px] mt-6">
          <button
            className="flex-1 py-3 text-white text-[16px] font-normal bg-primary rounded-[5px]"
            onClick={openProfileModal}
          >
            프로필 편집
          </button>
          <button
            className="flex-1 py-3 text-white text-[16px] font-normal bg-primary rounded-[5px]"
            onClick={handleShareProfile}
          >
            프로필 공유
          </button>
        </div>

        {isCopied && <div className="mt-4 text-primary font-pretendard font-regular text-center">copied</div>}
      </div>
      {isImageModalOpen && <ProfileImageForm onClose={closeImageModal} onSave={handleSaveImage} />}
      {isProfileModalOpen && <ProfileForm onClose={closeProfileModal} onUsernameUpdate={handleUsernameUpdate} />}{" "}
      {/* onUsernameUpdate 추가 */}
    </div>
  );
}
