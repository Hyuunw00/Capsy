import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import capsuleBlack from "../../assets/profile-capsule-black.svg";
import capsulePurple from "../../assets/profile-capsule-purple.svg";
import articleBlack from "../../assets/profile-article-black.svg";
import articlePurple from "../../assets/profile-article-purple.svg";
import alarmBlack from "../../assets/profile-alarm-black.svg";
import alarmPurple from "../../assets/profile-alarm-purple.svg";
import MySlideHeader from "./MySlideHeader";
import MySlideContainer from "./MySlideContainer";
import { CHANNEL_ID_POST, CHANNEL_ID_TIMECAPSULE, getUserPosts } from "../../apis/apis";
import { tokenService } from "../../utils/token";

// 공개 완료 캡슐 아이템 예시
const openCapsuleItems = Array.from({ length: 20 }, (_, i) => `오픈된 캡슐 ${i + 1}`);
// 공개 대기 캡슐 아이템 예시
const closeCapsuleItems = Array.from({ length: 20 }, (_, i) => `대기중 캡슐 ${i + 1}`);
// 공개 완료 예약 아이템 예시
const openAlarmItems = Array.from({ length: 20 }, (_, i) => `오픈된 예약 ${i + 1}`);
// 공개 대기 예약 아이템 예시
const closeAlarmItems = Array.from({ length: 20 }, (_, i) => `대기중 예약 ${i + 1}`);

interface PostType {
  _id: string;
  title: string;
  image?: string;
  channel?: {
    _id: string;
  };
  likes: Array<any>; // 좋아요 정보의 정확한 타입을 모르므로 any 사용
  comments: Array<any>; // 댓글 정보의 정확한 타입을 모르므로 any 사용
  createdAt: string;
  updatedAt: string;
}

function ProfileContainer() {
  const [selectedTab, setSelectedTab] = useState("capsules");
  const [postItems, setPostItems] = useState({});
  const [capsuleItems, setCapsuleItems] = useState([]);
  // const [articleItems, setArticleItems] = useState([]);
  const navigate = useNavigate();

  const handleTabClick = (tab: string) => {
    setSelectedTab(tab);
  };

  const user = tokenService.getUser();
  const userAuthorId = user._id;

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const posts = await getUserPosts(userAuthorId);
        setPostItems(posts);
      } catch (error) {
        console.error("포스트 불러오기 실패", error);
      }
    };
    fetchPosts();
  }, [userAuthorId]);

  console.log(postItems);

  const postsArray: PostType[] = Object.values(postItems);
  const articleItems = postsArray.filter((post) => post.channel?._id === CHANNEL_ID_POST);

  console.log(articleItems);

  // 전체보기 클릭 시 캡슐 탭과 예약글 탭 구분
  const handleShowAllClick = (type: "open" | "close", tabType: "capsules" | "alarms") => {
    const state =
      tabType === "capsules"
        ? type === "open"
          ? { title: "공개 완료", items: openCapsuleItems }
          : { title: "공개 대기", items: closeCapsuleItems }
        : type === "open"
          ? { title: "공개 완료", items: openAlarmItems }
          : { title: "공개 대기", items: closeAlarmItems };
    // tabType에 맞는 페이지로 이동
    navigate(tabType === "capsules" ? "/capsule-list" : "/alarm-list", { state });
  };
  return (
    <div className="profile-container">
      {/* Tab Navigation */}
      <div className="flex mb-6 justify-evenly">
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
            <span className="text-[16px] font-semibold font-pretendard">{label}</span>
          </div>
        ))}
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {selectedTab === "capsules" && (
          <>
            {/* 공개완료 슬라이드 */}
            <MySlideHeader
              title="공개완료"
              count={openCapsuleItems.length}
              showAllText="전체보기"
              onShowAllClick={() => handleShowAllClick("open", "capsules")}
            />
            <MySlideContainer uniqueKey="open" items={openCapsuleItems.slice(0, 8)} />

            {/* 공개대기 슬라이드 */}
            <div className="mt-8 mb-8">
              <MySlideHeader
                title="공개대기"
                count={closeCapsuleItems.length}
                showAllText="전체보기"
                onShowAllClick={() => handleShowAllClick("close", "capsules")}
              />
              <MySlideContainer uniqueKey="close" items={closeCapsuleItems.slice(0, 8)} />
            </div>
          </>
        )}

        {selectedTab === "articles" && (
          <div className="px-[30px]">
            <h2 className="text-[16px] font-pretendard flex items-center mb-[10px]">
              <span className="font-semibold">일반글</span>
              <span className="ml-1 font-semibold">{articleItems.length}</span>
            </h2>
            <div className="grid grid-cols-3 gap-[10px] mb-[30px]">
              {articleItems.map((item: PostType, index) => {
                const content = JSON.parse(item.title);
                return (
                  <div
                    key={index}
                    className="flex-col w-full item-middle"
                  >
                    <img className="object-contain w-full aspect-[1] bg-gray-200 rounded-[10px]" src={item.image} alt={`일반 포스트 이미지 ${index}`} />
                    <p>{content.title}</p>
                    
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {selectedTab === "alarms" && (
          <>
            {/* 공개완료 예약글 슬라이드 */}
            <MySlideHeader
              title="공개완료"
              count={openAlarmItems.length}
              showAllText="전체보기"
              onShowAllClick={() => handleShowAllClick("open", "alarms")}
            />
            <MySlideContainer uniqueKey="open" items={openAlarmItems.slice(0, 8)} />

            {/* 공개대기 예약글 슬라이드 */}
            <div className="mt-8 mb-8">
              <MySlideHeader
                title="공개대기"
                count={closeAlarmItems.length}
                showAllText="전체보기"
                onShowAllClick={() => handleShowAllClick("close", "alarms")}
              />
              <MySlideContainer uniqueKey="close" items={closeAlarmItems.slice(0, 8)} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default ProfileContainer;
