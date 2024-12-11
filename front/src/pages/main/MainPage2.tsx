import { useEffect, useState } from "react";
import dummyData from "./dummy.json";
import MainSearch from "./MainSearch";
import img_bottom from "../../assets/bottom-arrow.svg";
import img_capsule from "../../assets/icon_capsule.svg";
import img_heart from "../../assets/Heart_Curved.svg";
import img_fillHeart from "../../assets/heart-fill.svg";
import img_noti from "../../assets/Notification-white.svg";
import img_fillNoti from "../../assets/Notification-fill.svg";
// import img_noti_disable from "../../assets/Notification-disabled.svg";
import img_scroll from "../../assets/scroll-icon.svg";
import { useMainSearchStore } from "../../store/mainSearchStore";
import MainSearchModal from "./MainSearchModal";

interface DummyItem {
  image: string;
  userId: string;
  title: string;
  channelId?: string; // 차후에 옵셔널 체이닝 제거
}

export default function MainPage2() {
  // 전체 게시글 데이터 (현재는 dummyData)
  const [data, setData] = useState<DummyItem[]>([]);
  // 필터링 된 데이터
  const [filterData, setFilterData] = useState<DummyItem[]>([]);
  // 필터링 드롭다운 토글 여부
  const [isOpen, setIsOpen] = useState<boolean>(false);
  // 필터링 드롭다운 선택한 옵션
  const [selectedOption, setSelectedOption] = useState<string>("All");
  // 각 게시물 좋아요 상태 관리
  const [likeStatus, setLikeStatus] = useState<boolean[]>([]);
  // 각 게시물 알림 상태 관리
  const [notiStatus, setNotiStatus] = useState<boolean[]>([]);

  // 필터링 드롭다운
  const toggleDropdown = (): void => setIsOpen(!isOpen);

  // 필터링 옵션
  const selectOption = (option: string): void => {
    setSelectedOption(option);
    setIsOpen(false);
  };

  // 스크롤 버튼(클릭 시 맨 위로 이동)
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // 페이지 로딩 시 더미데이터 보여줌
  useEffect(() => {
    setData(dummyData);
  }, []);

  // 필터링 로직
  useEffect(() => {
    if (selectedOption === "All") {
      setFilterData(data);
    } else if (selectedOption === "포스트") {
      setFilterData(data.filter((item) => item.channelId === "post"));
    } else if (selectedOption === "타임캡슐") {
      setFilterData(data.filter((item) => item.channelId === "capsule"));
    }
  }, [selectedOption, data]);

  // 좋아요 버튼 클릭 이벤트 핸들러
  const handleLikeClick = (index: number) => {
    setLikeStatus((prevLikeStatus) => {
      const newLikeStatus = [...prevLikeStatus];
      newLikeStatus[index] = !newLikeStatus[index];
      return newLikeStatus;
    });
  };

  // 알림 버튼 클릭 이벤트 핸들러
  const handleNotiClick = (index: number) => {
    setNotiStatus((prevNotiStatus) => {
      const newNotiStatus = [...prevNotiStatus];
      newNotiStatus[index] = !newNotiStatus[index];
      return newNotiStatus;
    });
  };

  const isFocused = useMainSearchStore((state) => state.isFocused);

  if (isFocused) {
    return (
      <>
        <MainSearch />
        <MainSearchModal />
      </>
    );
  }
  return (
    <>
      <MainSearch />
      <div className="px-8 mt-3 relative">
        {/* 드롭다운 */}
        <div className="flex justify-end">
          <div>
            <div className="flex justify-end">
              <button
                onClick={toggleDropdown}
                className="inline-flex justify-around items-center bg-white focus:outline-none"
              >
                {selectedOption}
                <img src={img_bottom} alt="선택" />
              </button>
            </div>

            {isOpen && (
              <div className="absolute rounded-[6px] mt-2 shadow-300 z-10 right-8 bg-white">
                <div className="flex flex-col px-5 py-2 flex-nowrap">
                  {["All", "포스트", "타임캡슐"].map((option) => (
                    <button
                      key={option}
                      onClick={() => selectOption(option)}
                      className={`block w-full px-4 py-1.5 text-sm text-center hover:bg-gray-100  ${
                        selectedOption === option ? "font-semibold" : ""
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 게시물 data */}
        <div className="columns-2 gap-x-[20px] mt-3">
          {filterData.map((item, index) => (
            <div key={index} className="w-full inline-block break-inside-avoid  relative mb-[10px]">
              <img src={item.image} alt={item.title} className="w-full h-auto object-cover" />
              {item.channelId === "capsule" && (
                <div className="absolute top-[6px] right-[6px]">
                  <img src={img_capsule} alt="캡슐" />
                </div>
              )}
              <div className="absolute bottom-[6px] left-[6px] w-full text-white px-1">
                <p className="font-semibold">@{item.userId}</p>
                <p>{item.title}</p>
              </div>
              <div className="absolute bottom-[6px] right-[6px] flex flex-col justify-center items-center space-y-1">
                <img
                  src={likeStatus[index] ? img_fillHeart : img_heart}
                  alt="heart"
                  className="w-[20px] h-[20px] object-contain cursor-pointer"
                  onClick={() => handleLikeClick(index)}
                />
                {item.channelId === "capsule" && (
                  <img
                    src={notiStatus[index] ? img_fillNoti : img_noti}
                    alt="noti"
                    className={`object-contain cursor-pointer h-[20px] ${notiStatus[index] ? "w-[16px]" : "w-[18px]"}`}
                    onClick={() => handleNotiClick(index)}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
        {/* 스크롤 버튼 */}
        <div className="fixed bottom-[80px] right-8">
          <button
            onClick={scrollToTop}
            className="bg-black w-[72px] h-[72px] rounded-[36px] flex justify-center items-center"
          >
            <img src={img_scroll} alt="Top" />
          </button>
        </div>
      </div>
    </>
  );
}
