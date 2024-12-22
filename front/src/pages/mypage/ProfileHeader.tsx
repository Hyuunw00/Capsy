import { useEffect, useState } from "react";
import ProfileForm from "./modal/ProfileForm";
import ProfileImageForm from "./modal/ProfileImageForm";
import { tokenService } from "../../utils/token";
import { getMyProfile, uploadUserPhoto } from "../../apis/apis";
import { useNavigate } from "react-router-dom";
import Loading from "../../components/Loading"; // 로딩 컴포넌트
import userImg from "../../assets/user.png";
import NotificationModal from "../../components/NotificationModal";
import axiosInstance from "../../apis/axiosInstance";
import { useLoginStore } from "../../store/loginStore";

export default function ProfileHeader() {
  const navigate = useNavigate();
  const logout = useLoginStore((state) => state.logout);

  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false); // 로그아웃 모달
  const [isCopied, setIsCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태 추가

  const [user, setUser] = useState<UserLists | null>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [username, setUsername] = useState("");

  const openProfileModal = () => setIsProfileModalOpen(true);
  const closeProfileModal = () => setIsProfileModalOpen(false);

  const openImageModal = () => setIsImageModalOpen(true);
  const closeImageModal = () => setIsImageModalOpen(false);

  const [showDropdown, setShowDropdown] = useState(false);

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
  //로그아웃 모달 표시 함수
  const handleLogoutClick = () => {
    setIsOpen(true);
    setShowDropdown(false);
  };

  useEffect(() => {
    getUserInfo();
  }, []);

  useEffect(() => {
    const closeDropdown = () => setShowDropdown(false);
    document.addEventListener("click", closeDropdown);
    return () => document.removeEventListener("click", closeDropdown);
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

  const toggleDropdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDropdown(!showDropdown);
  };

  // 로그아웃 처리 함수
  const handleLogout = async () => {
    try {
      await axiosInstance.post("/logout");
      navigate("/");
      logout();
      tokenService.clearAll();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      {/* 로그아웃 확인 모달 */}
      {isOpen && (
        <NotificationModal isOpen={isOpen} title="알림" description="로그아웃 하시겠습니까?">
          <div className="gap-2 item-between">
            <button
              className="w-full h-10 border border-black rounded-md dark:border-white dark:text-white"
              onClick={() => setIsOpen(false)}
            >
              취소
            </button>
            <button
              className="w-full h-10 text-white bg-primary dark:bg-secondary rounded-md dark:text-black "
              onClick={handleLogout}
            >
              확인
            </button>
          </div>
        </NotificationModal>
      )}

      <div className="px-[30px] py-6 mb-[30px] font-pretendard">
        {isLoading ? ( // 로딩 중이면 Loading 화면 표시
          <Loading />
        ) : (
          <div className="flex flex-col">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold mb-[20px] text-[20px] text-black dark:text-white">@{user?.fullName}</h2>
              <div className="relative">
                <button
                  onClick={toggleDropdown}
                  className="flex items-center justify-center w-8 h-8 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-500"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M4.5 10.5C3.675 10.5 3 11.175 3 12C3 12.825 3.675 13.5 4.5 13.5C5.325 13.5 6 12.825 6 12C6 11.175 5.325 10.5 4.5 10.5ZM19.5 10.5C18.675 10.5 18 11.175 18 12C18 12.825 18.675 13.5 19.5 13.5C20.325 13.5 21 12.825 21 12C21 11.175 20.325 10.5 19.5 10.5ZM12 10.5C11.175 10.5 10.5 11.175 10.5 12C10.5 12.825 11.175 13.5 12 13.5C12.825 13.5 13.5 12.825 13.5 12C13.5 11.175 12.825 10.5 12 10.5Z"
                      fill="currentColor"
                      className="text-black dark:text-white"
                    />
                  </svg>
                </button>
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-32 px-[6px] bg-white dark:bg-gray-600 rounded-lg shadow-lg border border-gray-200 dark:border-gray-500 z-50">
                    <ul className="py-1">
                      <li>
                        <button
                          onClick={handleLogoutClick}
                          className="w-full px-4 py-2 text-sm font-normal text-center transition-all text-primary dark:text-secondary hover:font-semibold dark:hover:bg-gray-500 hover:bg-gray-100"
                        >
                          로그아웃
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
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
              <div className="mt-4 text-center text-primary dark:text-secondary font-pretendard font-regular">
                copied
              </div>
            )}
          </div>
        )}
        {isImageModalOpen && <ProfileImageForm onClose={closeImageModal} onSave={handleSaveImage} />}
        {isProfileModalOpen && <ProfileForm onClose={closeProfileModal} onUsernameUpdate={handleUsernameUpdate} />}{" "}
        {/* onUsernameUpdate 추가 */}
      </div>
    </>
  );
}
