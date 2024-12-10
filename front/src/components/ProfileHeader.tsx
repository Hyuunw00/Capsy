import profileImgEditIcon from "../assets/profile-img-edit-icon.svg";
import profileImgSample from "../assets/profile-img-sample.jpg";

export default function ProfileHeader() {
  const username = "@caapsy_human";
  const posts = 19;
  const followers = 99;
  const following = 99;

  return (
    <div className="px-[30px] py-6">
      {/* 프로필 정보 헤더 */}
      <div className="flex flex-col ">
        <h2 className="text-xl font-semibold">{username}</h2>
        {/* 프로필 이미지 */}
        <div className="relative">
          <img src={profileImgSample} alt="Profile" className="w-[90px] h-[90px] rounded-full object-cover" />
          <label
            htmlFor="profileImageInput"
            className="absolute bottom-0 right-0 transform translate-x-[30%] translate-y-[30%] bg-white p-1.5 rounded-full cursor-pointer"
          >
            <img src={profileImgEditIcon} alt="Edit Icon" className="w-5 h-5" />
          </label>
          <input type="file" id="profileImageInput" accept="image/*" className="hidden" />
        </div>

        {/* 게시물, 팔로워, 팔로잉 */}
        <div className="ml-6 flex flex-1 justify-between text-center">
          <div className="flex flex-col items-center">
            <span className="font-semibold text-[14px]">{posts}</span>
            <span className="font-normal text-[14px]">게시물</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="font-semibold text-[14px]">{followers}</span>
            <span className="font-normal text-[14px]">팔로워</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="font-semibold text-[14px]">{following}</span>
            <span className="font-normal text-[14px]">팔로잉</span>
          </div>
        </div>
      </div>

      {/* 프로필 편집과 프로필 공유 버튼 */}
      <div className="flex space-x-[5px] mt-6">
        {/* 프로필 편집 버튼 */}
        <button className="flex-1 py-3 text-white text-[14px] font-normal bg-primary rounded-[10px]">
          프로필 편집
        </button>
        {/* 프로필 공유 버튼 */}
        <button className="flex-1 py-3 text-white text-[14px] font-normal bg-primary rounded-[10px]">
          프로필 공유
        </button>
      </div>
    </div>
  );
}
