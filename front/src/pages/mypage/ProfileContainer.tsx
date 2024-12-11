import { useState } from "react";
import capsuleBlack from "../../assets/profile-capsule-black.svg";
import capsulePurple from "../../assets/profile-capsule-purple.svg";
import articleBlack from "../../assets/profile-article-black.svg";
import articlePurple from "../../assets/profile-article-purple.svg";
import alarmBlack from "../../assets/profile-alarm-black.svg";
import alarmPurple from "../../assets/profile-alarm-purple.svg";
import MySlideHeader from "../../components/MySlideHeader";
import MySlideContainer from "../../components/MyslideContainer";

const openCapsuleCount = 6;
const closeCapsuleCount = 4;
const articleCount = 9;
const openAlarmCount = 6;
const closeAlarmCount = 4;

const openCapsuleItems = Array.from({ length: 8 }, (_, i) => `캡슐 ${i + 1}`);
const closeCapsuleItems = Array.from({ length: 8 }, (_, i) => `캡슐 ${i + 1}`);
const openAlarmItems = Array.from({ length: 8 }, (_, i) => `알람 ${i + 1}`);
const closeAlarmItems = Array.from({ length: 8 }, (_, i) => `알람 ${i + 1}`);

function ProfileContainer() {
  const [selectedTab, setSelectedTab] = useState("capsules");
  const [showAllCapsules, setShowAllCapsules] = useState(false);

  const handleTabClick = (tab: string) => setSelectedTab(tab);

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
            className={`tab flex flex-col items-center cursor-pointer ${
              selectedTab === tab ? "text-primary" : "text-black"
            }`}
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
            <MySlideHeader
              title="공개완료"
              count={openCapsuleCount}
              showAllText={showAllCapsules ? "상세페이지목록" : "전체보기"}
              onShowAllClick={() => setShowAllCapsules(!showAllCapsules)}
            />
            <MySlideContainer items={openCapsuleItems} />
            <MySlideHeader
              title="공개대기"
              count={closeCapsuleCount}
              showAllText={showAllCapsules ? "상세페이지목록" : "전체보기"}
              onShowAllClick={() => setShowAllCapsules(!showAllCapsules)}
            />
            <MySlideContainer items={closeCapsuleItems} />
          </>
        )}

        {selectedTab === "articles" && <MySlideHeader title="일반글" count={articleCount} showAllText="전체보기" />}

        {selectedTab === "alarms" && (
          <>
            <MySlideHeader
              title="공개완료"
              count={openAlarmCount}
              showAllText={showAllCapsules ? "상세페이지목록" : "전체보기"}
              onShowAllClick={() => setShowAllCapsules(!showAllCapsules)}
            />
            <MySlideContainer items={openAlarmItems} />
            <MySlideHeader
              title="공개대기"
              count={closeAlarmCount}
              showAllText={showAllCapsules ? "상세페이지목록" : "전체보기"}
              onShowAllClick={() => setShowAllCapsules(!showAllCapsules)}
            />
            <MySlideContainer items={closeAlarmItems} />
          </>
        )}
      </div>
    </div>
  );
}

export default ProfileContainer;
