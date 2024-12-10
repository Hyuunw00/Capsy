import profileImgEditIcon from "../assets/profile-img-edit-icon.svg";
import profileImgSample from "../assets/profile-img-sample.jpg";

export default function ProfileHeader() {
  const username = "@caapsy_human";
  const posts = 19;
  const followers = 99;
  const following = 99;
  const nickname = "캡시햄찌";

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
          <button className="flex-1 py-3 text-white text-[14px] font-normal bg-primary rounded-[10px]">
            프로필 편집
          </button>
          {/* 프로필 공유 버튼 */}
          <button className="flex-1 py-3 text-white text-[14px] font-normal bg-primary rounded-[10px]">
            프로필 공유
          </button>
        </div>
      </div>
    </div>
  );
}
