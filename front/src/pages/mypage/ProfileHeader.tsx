import { useState } from "react";
import profileImgEditIcon from "../../assets/profile-img-edit-icon.svg";
import profileImgSample from "../../assets/profile-img-sample.jpg";
import ProfileForm from "./modal/ProfileForm";

export default function ProfileHeader() {
  const username = "@caapsy_human";
  const posts = 19;
  const followers = 99;
  const following = 99;
  const nickname = "캡시햄찌";

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleShareProfile = async () => {
    const profileUrl = `https://mywebsite.com/${username}`;

    try {
      await navigator.clipboard.writeText(profileUrl); // 클립보드에 텍스트 복사
      setIsCopied(true); // 복사 성공 상태 변경
      setTimeout(() => setIsCopied(false), 2000); // 2초 후 복사 알림 초기화
    } catch (error) {
      console.error("Failed to copy: ", error);
    }
  };

  return (
    <div className="px-[30px] py-6 mb-[30px]">
      {/* 헤더 */}
      <div className="flex flex-col">
        {/* 유저 이름 */}
        <h2 className="text-xl font-semibold mb-[20px]">{username}</h2>

        <div className="flex items-center justify-evenly">
          {/* 프로필 이미지 */}
          <div className="relative w-[90px] h-[90px]">
            <img src={profileImgSample} alt="Profile" className="w-full h-full rounded-full object-cover" />

            {/* 편집 아이콘 */}
            <label
              htmlFor="profileImageInput"
              className="absolute bottom-0 right-0 cursor-pointer z-10"
              style={{
                width: "30px",
                height: "30px",
                marginBottom: "0px",
                marginRight: "0px",
              }}
            >
              <img src={profileImgEditIcon} alt="Edit Icon" className="w-full h-full" />
            </label>

            <input type="file" id="profileImageInput" accept="image/*" className="hidden" />
          </div>

          {/* 중앙: 게시물, 팔로워, 팔로잉 */}
          <div className="flex flex-1 justify-evenly text-center mt-4">
            <div className="flex flex-col items-center">
              <span className="font-semibold text-[14px]">{posts}</span>
              <span className="font-normal text-[14px]">게시물</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-semibold text-[14px]">{followers}</span>
              <span className="font-normal text-[14px]">팔로워</span>
            </div>
            <div className="flex flex-col items-center last:mr-0">
              <span className="font-semibold text-[14px]">{following}</span>
              <span className="font-normal text-[14px]">팔로잉</span>
            </div>
          </div>
        </div>

        {/* 닉네임 부분 추가 */}
        <div className="mt-[20px]">
          <h3 className="text-[14px] font-regular">{nickname}</h3>
        </div>

        {/* 프로필 편집과 프로필 공유 버튼 */}
        <div className="flex space-x-[5px] mt-6">
          {/* 프로필 편집 버튼 */}
          <button
            className="flex-1 py-3 text-white text-[14px] font-normal bg-primary rounded-[10px]"
            onClick={openModal}
          >
            프로필 편집
          </button>
          {/* 프로필 공유 버튼 */}
          <button
            className="flex-1 py-3 text-white text-[14px] font-normal bg-primary rounded-[10px]"
            onClick={handleShareProfile}
          >
            프로필 공유
          </button>
        </div>

        {/* 복사 알림 */}
        {isCopied && <div className="mt-4 text-primary font-pretendard font-regular text-center">copied</div>}
      </div>

      {/* 모달이 열릴 때만 ProfileForm을 표시 */}
      {isModalOpen && <ProfileForm onClose={closeModal} />}
    </div>
  );
}
