import { useState } from "react";
import { useNavigate } from "react-router-dom";
import capsuleBlack from "../../assets/profile-capsule-black.svg";
import capsulePurple from "../../assets/profile-capsule-purple.svg";
import articleBlack from "../../assets/profile-article-black.svg";
import articlePurple from "../../assets/profile-article-purple.svg";
import alarmBlack from "../../assets/profile-alarm-black.svg";
import alarmPurple from "../../assets/profile-alarm-purple.svg";
import MySlideHeader from "../../components/MySlideHeader";
import MySlideContainer from "../../components/MySlideContainer";

// 공개 완료 아이템 예시
const openCapsuleItems = Array.from({ length: 20 }, (_, i) => `오픈된 캡슐 ${i + 1}`);
// 공개 대기 아이템 예시
const closeCapsuleItems = Array.from({ length: 10 }, (_, i) => `대기 중 캡슐 ${i + 1}`);

function ProfileContainer() {
  const [selectedTab, setSelectedTab] = useState("capsules");
  const navigate = useNavigate();

  const handleTabClick = (tab: string) => {
    setSelectedTab(tab);
  };

  const handleShowAllClick = (type: "open" | "close") => {
    const state =
      type === "open"
        ? { title: "공개 완료", items: openCapsuleItems }
        : { title: "공개 대기", items: closeCapsuleItems };

    navigate("/capsule-list", { state });
  };

  return (
    <div className="profile-container">
      {/* Tab Navigation */}
      <div className="flex justify-evenly mb-6">
        {[
          { tab: "capsules", iconBlack: capsuleBlack, iconPurple: capsulePurple, label: "내 캡슐" },
          { tab: "articles", iconBlack: articleBlack, iconPurple: articlePurple, label: "내 일반글" },
          { tab: "alarms", iconBlack: alarmBlack, iconPurple: alarmPurple, label: "예약글" },
        ].map(({ tab, iconBlack, iconPurple, label }) => (
          <div
            key={tab}
            className={`tab flex flex-col items-center cursor-pointer ${selectedTab === tab ? "text-primary" : "text-black"}`}
            onClick={() => handleTabClick(tab)}
          >
            <img src={selectedTab === tab ? iconPurple : iconBlack} alt={label} className="w-[25px] h-[25px] mb-2" />
            <span className="text-[14px] font-regular font-pretendard">{label}</span>
          </div>
        ))}
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {selectedTab === "capsules" && (
          <>
            {/* 공개완료 슬라이드 */}
            <MySlideHeader
              title="공개 완료"
              count={6}
              showAllText="전체보기"
              onShowAllClick={() => handleShowAllClick("open")}
            />
            <MySlideContainer key="open" uniqueKey="open" items={openCapsuleItems.slice(0, 8)} />

            {/* 공개대기 슬라이드 */}
            <div className="mt-8">
              <MySlideHeader
                title="공개 대기"
                count={closeCapsuleItems.length}
                showAllText="전체보기"
                onShowAllClick={() => handleShowAllClick("close")}
              />
              <MySlideContainer key="close" uniqueKey="close" items={closeCapsuleItems.slice(0, 8)} />
            </div>
          </>
        )}

        {/* 다른 탭의 콘텐츠 */}
        {selectedTab === "articles" && (
          <div className="px-4">
            <h2 className="text-xl font-bold">내 일반글</h2>
            <div className="grid grid-cols-3 gap-4 mt-4">
              {openCapsuleItems.slice(0, 10).map((item, index) => (
                <div
                  key={index}
                  className="w-full aspect-[1] bg-gray-200 rounded-[10px] flex justify-center items-center"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedTab === "alarms" && (
          <div className="px-4">
            <h2 className="text-xl font-bold">예약글</h2>
            <div className="grid grid-cols-3 gap-4 mt-4">
              {closeCapsuleItems.slice(0, 10).map((item, index) => (
                <div
                  key={index}
                  className="w-full aspect-[1] bg-gray-200 rounded-[10px] flex justify-center items-center"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProfileContainer;
