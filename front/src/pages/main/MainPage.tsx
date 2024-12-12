import { useEffect, useState } from "react";
import axiosInstance from "../../apis/axiosInstance";
import { CHANNEL_ID_POST, CHANNEL_ID_TIMECAPSULE } from "../../apis/apis";
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

interface Like {
  _id: string;
  user: string;
  post: string;
  createdAt: string;
  updatedAt: string;
}

interface Channel {
  authRequired: boolean;
  posts: string[];
  _id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

interface Author {
  role: string;
  emailVerified: boolean;
  banned: boolean;
  isOnline: boolean;
  posts: string[];
  likes: string[];
  comments: string[];
  followers: string[];
  following: string[];
  notifications: string[];
  messages: string[];
  _id: string;
  fullName: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  username: string | null;
  image: string;
  imagePublicId: string;
}

interface Post {
  likes: Like[];
  comments: string[];
  _id: string;
  title: string;
  image?: string;
  imagePublicId?: string;
  channel: Channel;
  author: Author;
  createdAt: string;
  updatedAt: string;
}

export default function MainPage() {
  // 전체 게시글 데이터 (현재는 dummyData)
  const [data, setData] = useState<Post[]>([]);
  // 일반 게시글 post 데이터
  const [postData, setPostData] = useState<Post[]>([]);
  // 타임 캡슐 데이터
  const [capsuleData, setCapsuleData] = useState<Post[]>([]);
  // 필터링 된 데이터
  const [filterData, setFilterData] = useState<Post[]>([]);
  // 필터링 드롭다운 토글 여부
  const [isOpen, setIsOpen] = useState<boolean>(false);
  // 필터링 드롭다운 선택한 옵션
  const [selectedOption, setSelectedOption] = useState<string>("All");
  // 각 게시물 알림 상태 관리
  const [notiStatus, setNotiStatus] = useState<boolean[]>([]);

  // 각 게시물 좋아요 상태 관리
  const [userData, _] = useState(() => {
    const storedUserData = sessionStorage.getItem("user");
    return storedUserData ? JSON.parse(storedUserData) : { likes: [] };
  });

  const [likeStatus, setLikeStatus] = useState<{ [key: string]: boolean }>({});

  // 전역 상태 변수
  const isFocused = useMainSearchStore((state) => state.isFocused);
  const searchInput = useMainSearchStore((state) => state.searchInput);
  const setSearchInput = useMainSearchStore((state) => state.setSearchInput);
  const setIsfocused = useMainSearchStore((state) => state.setIsFocused);

  //  뒤로가기 버튼
  const handleBackClick = () => {
    setSearchInput("");
    setFilterData(data);
    setIsfocused(false);
  };

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

  // 좋아요 버튼 클릭 이벤트 핸들러
  const handleLikeClick = async (postId: string) => {
    console.log("postId: ", postId);
    const userId = userData._id;
    console.log("My ID: ", userId);

    // 전체 데이터와 클릭한 post id 비교
    const post = filterData.find((post) => post._id === postId);

    // 포스트 없으면 return
    if (!post) return;

    // 유저가 해당 게시글 좋아요 눌렀었는지 확인
    const userLikes = post?.likes.filter((like) => like.user === userId);
    console.log("userLikes", userLikes);

    try {
      // 좋아요를 누르지 않았다면 추가
      if (userLikes.length === 0) {
        const response = await axiosInstance.post("/likes/create", { postId });
        const newLike = {
          _id: response.data._id,
          post: postId,
          user: userId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        post.likes.push(newLike);
        console.log("좋아요 추가 완료!", post.likes);
        setLikeStatus((prevState) => ({ ...prevState, [postId]: true }));
      } else {
        // 좋아요를 눌렀었다면 취소
        const likeId = userLikes[0]._id;
        await axiosInstance.delete("/likes/delete", { data: { id: likeId } });
        post.likes = post.likes.filter((like) => like._id !== likeId);
        console.log("좋아요 취소 완료!", post.likes);
        setLikeStatus((prevState) => ({ ...prevState, [postId]: false }));
      }
    } catch (error) {
      console.error("좋아요 처리 실패: ", error);
    }
  };

  // 알림 버튼 클릭 이벤트 핸들러
  const handleNotiClick = (index: number) => {
    setNotiStatus((prevNotiStatus) => {
      const newNotiStatus = [...prevNotiStatus];
      newNotiStatus[index] = !newNotiStatus[index];
      return newNotiStatus;
    });
  };

  // 데이터 call
  useEffect(() => {
    const updateData = async (postChannelId: string, capsuleChannelId: string) => {
      try {
        const [postResponse, capsuleResponse] = await Promise.all([
          axiosInstance.get(`/posts/channel/${postChannelId}`),
          axiosInstance.get(`/posts/channel/${capsuleChannelId}`),
        ]);

        const allData = [...postResponse.data, ...capsuleResponse.data];

        setData(allData);
        setPostData(postResponse.data);
        setCapsuleData(capsuleResponse.data);
      } catch (error) {
        console.error("Error: ", error);
      }
    };
    updateData(CHANNEL_ID_POST, CHANNEL_ID_TIMECAPSULE);
  }, []);

  // 좋아요 상태 바뀌면 실행
  useEffect(() => {
    const updatedFilterData = filterData.map((post) => {
      const isLiked = post.likes.some((like) => like.user === userData._id);
      return {
        ...post,
        isLiked, // 좋아요 상태 업데이트
      };
    });
    const newLikeStatus = updatedFilterData.reduce<{ [key: string]: boolean }>((acc, post) => {
      acc[post._id] = post.isLiked;
      return acc;
    }, {});
    setLikeStatus(newLikeStatus);
  }, [filterData, userData]);

  // 필터링 로직
  useEffect(() => {
    if (selectedOption === "All") {
      setFilterData(data);
    } else if (selectedOption === "포스트") {
      setFilterData(postData);
    } else if (selectedOption === "타임캡슐") {
      setFilterData(capsuleData);
    }
  }, [selectedOption, data]);

  // 데이터 확인용 console.log
  useEffect(() => {
    console.log("filterData", filterData);
    console.log("userData", userData);
  }, [data, filterData]);

  // 검색된 게시물에대한 코드
  useEffect(() => {
    const getSearchPost = async () => {
      try {
        const keywordPost = data.filter((post) => post.title.includes(searchInput.replace(/\s+/g, "")));
        setFilterData(keywordPost);
      } catch (error) {
        console.error(error);
      }
    };
    getSearchPost();
  }, [isFocused]);

  if (isFocused) {
    return (
      <>
        <MainSearch onBackClick={handleBackClick} />
        <MainSearchModal />
      </>
    );
  }

  return (
    <>
      <MainSearch onBackClick={handleBackClick} />
      <div className="px-8 mt-3 relative">
        <div className="flex justify-between">
          {/* 키워드에 대한 검색 결과 */}
          <div>
            {searchInput.length > 0 && (
              <span>
                <strong>{searchInput}</strong> 관련된 포스트 결과
              </span>
            )}
          </div>
          {/* 드롭다운 */}
          {searchInput.length === 0 && (
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
          )}
        </div>

        {/* 게시물 data */}
        <div className="columns-2 gap-x-[20px] mt-3">
          {filterData.map((item, index) => (
            <div key={index} className="w-full inline-block break-inside-avoid  relative mb-[10px]">
              <img src={item.image} alt={item.title} className="w-full h-auto object-cover" />
              {item.channel.name === "TIMECAPSULE" && (
                <div className="absolute top-[6px] right-[6px]">
                  <img src={img_capsule} alt="캡슐" />
                </div>
              )}
              <div className="absolute bottom-[6px] left-[6px] w-full text-white px-1">
                <p className="font-semibold">@{item.author.fullName}</p>
                <p>{item.title}</p>
              </div>
              <div className="absolute bottom-[6px] right-[6px] flex flex-col justify-center items-center space-y-1">
                <img
                  src={likeStatus[item._id] ? img_fillHeart : img_heart}
                  className="w-[20px] h-[20px] object-contain cursor-pointer"
                  onClick={() => handleLikeClick(item._id)}
                />
                {item.channel.name === "capsule" && (
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
