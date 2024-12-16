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
interface PostType {
  _id: string;
  title: string;
  image?: string;
  channel?: {
    _id: string;
  };
  likes: Array<any>;
  comments: Array<any>;
  createdAt: string;
  updatedAt: string;
}
interface ParsedCapsule {
  title: string;
  content: string;
  closeAt: string;
}
interface CapsuleItem {
  id: string;
  title: string;
  content: string;
  image?: string;
  closeAt: Date;
}
// 게시글 내용 가져오기 유틸 함수
const getContent = (jsonString: string) => {
  try {
    const parsedData = JSON.parse(jsonString);
    return parsedData.content ? parsedData.content.replace(/\\\\n/g, "\n").replace(/\\n/g, "\n") : jsonString;
  } catch (error) {
    return jsonString;
  }
};
function ProfileContainer() {
  const [selectedTab, setSelectedTab] = useState("capsules");
  const [postItems, setPostItems] = useState<PostType[]>([]);
  const navigate = useNavigate();
  const handleTabClick = (tab: string) => {
    setSelectedTab(tab);
  };
  const handlePostClick = (postId: string) => {
    navigate(`/detail/${postId}`);
  };
  const user = tokenService.getUser();
  const userAuthorId = user._id;
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const posts = await getUserPosts(userAuthorId);
        setPostItems(Array.isArray(posts) ? posts : Object.values(posts));
      } catch (error) {
        console.error("포스트 불러오기 실패", error);
      }
    };
    fetchPosts();
  }, [userAuthorId]);
  const articleItems = postItems.filter((post) => post.channel?._id === CHANNEL_ID_POST);
  const capsuleItems = postItems.filter((post) => post.channel?._id === CHANNEL_ID_TIMECAPSULE);
  const categorizeCapsules = () => {
    const now = new Date();
    return capsuleItems.reduce<{ opened: CapsuleItem[]; waiting: CapsuleItem[] }>(
      (acc, item) => {
        try {
          const parsed: ParsedCapsule = JSON.parse(item.title);
          const closeAt = new Date(parsed.closeAt);

          const capsuleItem: CapsuleItem = {
            id: item._id,
            title: parsed.title,
            content: parsed.content?.replace(/\\n/g, "\n"),
            image: item.image,
            closeAt,
          };
          if (closeAt > now) {
            acc.waiting.push(capsuleItem);
          } else {
            acc.opened.push(capsuleItem);
          }
        } catch (error) {
          console.error("Error parsing capsule data:", error);
        }
        return acc;
      },
      { opened: [], waiting: [] },
    );
  };
  const handleShowAllClick = (type: "open" | "close", tabType: "capsules" | "alarms") => {
    const { opened, waiting } = categorizeCapsules();
    const items = type === "open" ? opened : waiting;

    navigate(tabType === "capsules" ? "/capsule-list" : "/alarm-list", {
      state: {
        title: type === "open" ? "공개 완료" : "공개 대기",
        items,
      },
    });
  };
  return (
    <div className="profile-container">
      <div className="flex mb-6 justify-evenly">
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
            <span className="text-[16px] font-semibold font-pretendard">{label}</span>
          </div>
        ))}
      </div>
      <div className="tab-content">
        {selectedTab === "capsules" &&
          (() => {
            const { opened, waiting } = categorizeCapsules();

            return (
              <>
                <MySlideHeader
                  title="공개완료"
                  count={opened.length}
                  showAllText="전체보기"
                  onShowAllClick={() => handleShowAllClick("open", "capsules")}
                />
                <MySlideContainer uniqueKey="open" items={opened} />
                <div className="mt-8 mb-8">
                  <MySlideHeader
                    title="공개대기"
                    count={waiting.length}
                    showAllText="전체보기"
                    onShowAllClick={() => handleShowAllClick("close", "capsules")}
                  />
                  <MySlideContainer uniqueKey="close" items={waiting} />
                </div>
              </>
            );
          })()}
        {selectedTab === "articles" && (
          <div className="px-[30px]">
            <h2 className="text-[16px] font-pretendard flex items-center mb-[10px]">
              <span className="font-semibold">일반글</span>
              <span className="ml-1 font-semibold">{articleItems.length}</span>
            </h2>
            <div className="grid grid-cols-3 gap-[10px] mb-[30px]">
              {articleItems.map((item, index) => {
                const content = JSON.parse(item.title);
                const textContent = getContent(item.title);
                return (
                  <div
                    key={item._id}
                    className="flex-col w-full cursor-pointer"
                    onClick={() => handlePostClick(item._id)}
                  >
                    {item.image ? (
                      <img
                        className="object-cover w-full aspect-[1] bg-black rounded-[10px] item-middle"
                        src={item.image}
                        alt={`일반 포스트 이미지 ${index}`}
                      />
                    ) : (
                      <div className="w-full aspect-[1] bg-gray-100 rounded-[10px] flex items-start justify-start p-[10px] border border-gray-200">
                        <p className="text-black text-[14px] font-pretendard font-regular break-words">{textContent}</p>
                      </div>
                    )}
                    <div className="mt-2 font-pretendard font-regular text-left text-[14px]">
                      <p>{content.title}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        {selectedTab === "alarms" && (
          <>
            <div className="mt-8 text-center text-gray-500">알람 기능은 준비 중입니다.</div>
          </>
        )}
      </div>
    </div>
  );
}
export default ProfileContainer;