import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axiosInstance from "../../apis/axiosInstance";
import { useMainSearchStore } from "../../store/mainSearchStore";
import { CHANNEL_ID_POST, CHANNEL_ID_TIMECAPSULE, createNotifications } from "../../apis/apis";

import MainSearch from "./MainSearch";
import MainSearchModal from "./MainSearchModal";
import Loading from "../../components/Loading";
import TimeCapsuleModal from "../../components/TimeCapsuleModal";

import img_bottom from "../../assets/bottom-arrow.svg";
import img_bottom_white from "../../assets/bottom-arrow-white.svg";
import img_capsule from "../../assets/icon_capsule.svg";
import img_heart from "../../assets/Heart_Curved.svg";
import img_fillHeart from "../../assets/heart-fill.svg";
import img_noti from "../../assets/Notification-white.svg";
import img_fillNoti from "../../assets/Notification-fill.svg";
import img_noti_disable from "../../assets/Notification-disabled.svg";
import img_scroll from "../../assets/scroll-icon.svg";
import img_timeCapsule from "../../assets/time-capsule.png";
import img_lock_timeCapsule from "../../assets/time-capsule-lock.png";
import img_alarm from "../../assets/alarm.png";
import { useThemeStore } from "../../store/themeStore";
import { flushSync } from "react-dom";

export default function MainPage() {
  const location = useLocation();
  // 다크모드
  const { isDark } = useThemeStore();
  const navigate = useNavigate();
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
  const [notiStatus, setNotiStatus] = useState<{ [key: string]: boolean }>({});
  // const [notiStatus, setNotiStatus] = useState<boolean[]>([]);
  // 각 게시물 좋아요, 알림 상태 관리
  const [userData, setUserData] = useState(() => {
    const storedUserData = sessionStorage.getItem("user");
    return storedUserData ? JSON.parse(storedUserData) : { likes: [], messages: [] };
  });
  // 좋아요 상태
  const [likeStatus, setLikeStatus] = useState<{ [key: string]: boolean }>({});
  // 로딩중인지에 대한 상태
  const [loading, setLoading] = useState<boolean>(true);
  // 미공개 타임캡슐 모달을 위한 상태 관리
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState({ imgSrc: "", neonText: "", whiteText: "" });
  // 알림 등록 모달을 위한 상태 관리
  const [showAlarmModal, setShowAlarmModal] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [alarmModalData, setAlarmModalData] = useState({
    imgSrc: "",
    neonText: "",
    whiteText: "",
  });
  // 타임캡슐 열린 모달을 위한 상태 관리
  const [showOpenModal, setShowOpenModal] = useState(false);
  const [openModalData, setOpenModalData] = useState<{
    imgSrc: string;
    neonText: string;
    whiteText: string;
    whiteTextClick: () => void;
  }>({
    imgSrc: "",
    neonText: "",
    whiteText: "",
    whiteTextClick: () => {},
  });
  // 페이지 진입 시 최초 실행 여부 체크
  const [initialLoad, setInitialLoad] = useState(true);

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

  // 포스트 컴포넌트 클릭 시
  const handleImageClick = (item: any) => {
    const isCapsuleTest = item.channel?.name === "CAPSULETEST";
    const isBeforeCloseAt = new Date().toISOString() < (getCloseAt(item.title)?.toISOString() ?? "");

    if (isCapsuleTest && isBeforeCloseAt) {
      setModalData({
        imgSrc: img_lock_timeCapsule,
        neonText: "미개봉 타임 캡슐입니다!",
        whiteText: "예약 시 알림을 받을 수 있어요",
      });
      setShowModal(true);
    } else {
      const scrollPosition = window.scrollY;
      flushSync(() => {
        navigate(`/detail/${item._id}`, { state: { scrollPosition } });
      });
    }
  };

  // 타임캡슐 모달 컴포넌트 X 버튼 클릭 시
  const handleCloseModal = () => {
    setShowModal(false);
  };

  // 오픈된 타임캡슐 있을 시 생기는 모달 컴포넌트 X 버튼 로직
  const handleOpenTCModal = () => {
    setShowOpenModal(false);
  };

  // 좋아요 버튼 클릭 이벤트 핸들러
  const handleLikeClick = async (postId: string) => {
    const userId = userData?._id;

    // 전체 데이터와 클릭한 post id 비교
    const post = filterData.find((post) => post._id === postId);

    // 포스트 없으면 return
    if (!post) return;

    // 유저가 해당 게시글 좋아요 눌렀었는지 확인
    const userLikes = post?.likes.filter((like) => like.user === userId);

    try {
      // 좋아요를 누르지 않았다면 추가
      if (userLikes.length === 0) {
        const response = await axiosInstance.post("/likes/create", { postId });
        const newLike = {
          _id: response.data._id,
          post: postId,
          user: userId!,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        post.likes.push(newLike);
        setLikeStatus((prevState) => ({ ...prevState, [postId]: true }));

        // 작성자가 자신의 게시글에 좋아요를 누를때는 알림  x
        if (post.author._id === userId) return;

        // 좋아요 알림 생성
        await createNotifications({
          notificationType: "LIKE",
          notificationTypeId: response.data._id,
          userId: post.author._id,
          postId: post._id,
        });
      } else {
        // 좋아요를 눌렀었다면 취소
        const likeId = userLikes[0]._id;
        await axiosInstance.delete("/likes/delete", { data: { id: likeId } });
        post.likes = post.likes.filter((like) => like._id !== likeId);
        setLikeStatus((prevState) => ({ ...prevState, [postId]: false }));
      }
    } catch (error: any) {
      if (error.response && error.response.status === 401) {
        navigate("/login");
      }
    }
  };

  const handleNotiClick = (postId: string) => {
    // 로그인하지 않은 경우 로그인 페이지로 리디렉션
    if (!userData?._id) {
      navigate("/login");
      return;
    }

    // 이미 해당 게시글에 알림이 설정된 경우
    const userNoti = userData?.messages.find((message: any) => {
      try {
        const parsedMessage = JSON.parse(message.message);
        return parsedMessage.postId === postId;
      } catch (error) {
        return false;
      }
    });

    if (userNoti) {
      alert("해당 게시글 알람을 이미 설정하셨습니다.");
      return;
    }

    // 알림을 설정하는 모달
    setAlarmModalData({
      imgSrc: img_alarm,
      neonText: "알림을 설정하면 취소할 수 없습니다",
      whiteText: "알림을 설정하시겠습니까?",
    });
    setShowAlarmModal(true);
    setSelectedPostId(postId);
  };

  const handleAlarmCloseModal = () => {
    setShowAlarmModal(false);
    setSelectedPostId(null);
  };

  // 알림 버튼 클릭 이벤트 핸들러
  const handleConfirm = async () => {
    if (!selectedPostId) return;

    try {
      const post = filterData.find((post) => post._id === selectedPostId);
      if (!post) return;

      const userId = userData?._id;

      const openAt = getCloseAt(post.title)?.toISOString();

      // 새로운 메세지 전송
      const messageResponse = await axiosInstance.post("/messages/create", {
        message: JSON.stringify({ postId: selectedPostId, openAt }),
        receiver: userId,
      });

      const newMessage = messageResponse.data;
      console.log("messageResponse: ", newMessage);

      setUserData((prevUserData: any) => {
        const updatedMessages = [...(prevUserData.messages || []), newMessage];
        const updatedUserData = {
          ...prevUserData,
          messages: updatedMessages,
        };
        sessionStorage.setItem("user", JSON.stringify(updatedUserData));
        return updatedUserData;
      });
      console.log("알림 예약 완료 되었습니다.");

      setNotiStatus((prevStatus: any) => {
        const updatedStatus = { ...prevStatus, [selectedPostId]: true };
        sessionStorage.setItem("notiStatus", JSON.stringify(updatedStatus));
        return updatedStatus;
      });

      handleAlarmCloseModal();
    } catch (error: any) {
      if (error.response && error.response.status === 401) {
        console.log("알림 처리 실패: 로그인이 필요합니다.");
        navigate("/login");
      }
    }
  };

  // 알림 리스트 가져오기
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        if (!userData?._id) {
          return;
        }
        // 최초 실행 여부를 확인해서 최초에만 메세지를 가져오도록 제한
        if (!initialLoad) {
          return;
        }
        const userId = userData?._id;

        const response = await axiosInstance.get("/messages", { params: { userId } });
        const allMessages = response.data;

        // 어제의 00:00:00 (KST) → UTC 변환 (UTC 기준 전날 15:00:00)
        const yesterdayStart = new Date();
        yesterdayStart.setDate(yesterdayStart.getDate() - 1);
        yesterdayStart.setHours(0, 0, 0, 0); // 00:00:00 (KST)
        const yesterdayStartUTC = yesterdayStart.toISOString();

        // 오늘의 00:00:00 (KST) → UTC 변환 (UTC 기준 당일 15:00:00)
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0); // 00:00:00 (KST)
        const todayStartUTC = todayStart.toISOString();

        const expiredMessages = allMessages?.filter((message: any) => {
          if (!message?.message) return false;

          const parsedMessage = JSON.parse(message.message);
          if (!parsedMessage.openAt) return false;

          return parsedMessage.openAt <= todayStartUTC && parsedMessage.openAt >= yesterdayStartUTC;
        });

        const displayedNotifications = JSON.parse(sessionStorage.getItem("displayedNotifications") || "[]");

        // 중복되지 않은 알림만 추가
        const newNotifications = expiredMessages?.filter((message: any) => {
          const parsedMessage = JSON.parse(message.message);
          return !displayedNotifications.includes(parsedMessage.postId);
        });

        if (newNotifications.length > 0) {
          console.log("새로 추가된 알림: ", newNotifications.length);
          const newPostIds = newNotifications.map((message: any) => JSON.parse(message.message).postId);
          const updatedDisplayedNotifications = [...displayedNotifications, ...newPostIds];
          sessionStorage.setItem("displayedNotifications", JSON.stringify(updatedDisplayedNotifications));

          if (newNotifications.length === 1) {
            const parsedMessage = JSON.parse(newNotifications[0].message);
            setOpenModalData({
              imgSrc: img_timeCapsule,
              neonText: "따끈따끈한 타임 캡슐 도착!",
              whiteText: "지금 확인하러 가기",
              whiteTextClick: () => navigate(`/detail/${parsedMessage.postId}`),
            });
          } else {
            setOpenModalData({
              imgSrc: img_timeCapsule,
              neonText: "따끈따끈한 타임 캡슐 도착!",
              whiteText: "지금 확인하러 가기",
              whiteTextClick: () => navigate("/mypage"),
            });
          }
          setShowOpenModal(true);
        }
        // userData 업데이트 및 세션 저장
        const updatedUserData = {
          ...userData,
          messages: allMessages,
        };

        if (updatedUserData._id) {
          sessionStorage.setItem("user", JSON.stringify(updatedUserData));
          setUserData(updatedUserData);
        }

        // 최초 실행 여부를 false로 변경해서 이후 실행 방지
        setInitialLoad(false);
      } catch (error) {
        console.error("메세지를 가져오는 중 오류 발생");
      }
    };

    fetchMessages();
  }, [userData?._id]);

  // 게시글 제목 가져오기
  const getTitle = (jsonString: any) => {
    try {
      const parsedData = JSON.parse(jsonString);
      return parsedData.title || jsonString;
    } catch (error) {
      // 기존의 데이터가 잘못 들어가있어 console을 잡아먹어 주석 처리
      // console.error("JSON parse error: ", error);
      return jsonString;
    }
  };

  // 게시글 내용 가져오기
  // 일단 이중 이스케이프(\\n)문, 단순한 이스케이프문(\n) 처리
  const getContent = (jsonString: any) => {
    try {
      const parsedData = JSON.parse(jsonString);
      return parsedData.content ? parsedData.content.replace(/\\\\n/g, "\n").replace(/\\n/g, "\n") : jsonString;
    } catch (error) {
      // 기존의 데이터가 잘못 들어가있어 console을 잡아먹어 주석 처리
      // console.error("JSON parse error: ", error);
      return jsonString;
    }
  };

  // 타임캡슐의 closeAt 날짜 가져오기
  const getCloseAt = (jsonString: any): Date | null => {
    try {
      const parsedData = JSON.parse(jsonString);
      if (parsedData.closeAt) {
        return new Date(parsedData.closeAt);
      }
      return null;
    } catch (error) {
      console.error("JSON parse error: ", error);
      return null;
    }
  };

  // 타임캡슐의 첫번째 이미지 가져오기
  const getFirstImage = (jsonString: any) => {
    try {
      const parsedData = JSON.parse(jsonString);
      if (parsedData.image) {
        return parsedData.image[0];
      }
      return null;
    } catch (error) {
      console.error("JSON parse error: ", error);
      return null;
    }
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

        // createdAt 내림차순 정렬
        const sortedData = allData.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        setData(sortedData);
        setPostData(postResponse.data);
        setCapsuleData(capsuleResponse.data);
      } catch (error) {
        console.error("Error: ", error);
      } finally {
        setLoading(false);
      }
    };
    updateData(CHANNEL_ID_POST, CHANNEL_ID_TIMECAPSULE);

    // unmount시 key관련 검색어 삭제 및, filtering 부분 생성
    return () => {
      setSearchInput("");
      setFilterData(data);
      setIsfocused(false);
    };
  }, []);

  // 좋아요 상태 바뀌면 실행
  useEffect(() => {
    const updatedFilterData = filterData.map((post) => {
      const isLiked = post.likes.some((like) => like.user === userData?._id);
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
  }, [filterData]);

  // 알림 상태가 바뀌면 실행
  useEffect(() => {
    const updatedFilterData = filterData.map((post) => {
      const isNotified = userData?.messages?.some((message: any) => {
        const parsedMessage = message.message ? JSON.parse(message.message) : null;
        return parsedMessage && parsedMessage.postId === post._id;
      });
      return {
        ...post,
        isNotified,
      };
    });

    const newNotiStatus = updatedFilterData.reduce<{ [key: string]: boolean }>((acc, post) => {
      acc[post._id] = post.isNotified ?? false;
      return acc;
    }, {});

    setNotiStatus(newNotiStatus);
  }, [filterData]);

  // 페이지 로드 시 sessionStorage에서 데이터 가져오기
  useEffect(() => {
    const storedUserData = sessionStorage.getItem("user");
    if (storedUserData) {
      const parsedUserData = JSON.parse(storedUserData);
      setUserData(parsedUserData);
      setNotiStatus(parsedUserData.notifications || {});
    }
  }, []);

  // userData가 업데이트될 때마다 sessionStorage에 저장
  useEffect(() => {
    if (userData) {
      sessionStorage.setItem("user", JSON.stringify(userData));
    }
  }, [userData]);

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

  // 페이지에 다시 돌아왔을 때 스크롤 복구
  useEffect(() => {
    if (!loading) {
      const scrollPosition = location.state?.scrollPosition;
      if (scrollPosition !== null) {
        requestAnimationFrame(() => {
          window.scrollTo(0, scrollPosition);
        });
      }
    }
  }, [loading]);

  if (isFocused) {
    return (
      <>
        <MainSearch onBackClick={handleBackClick} />
        <MainSearchModal />
      </>
    );
  }

  // 데이터 로딩중일시 로딩 화면
  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <MainSearch onBackClick={handleBackClick} />
      <div className="relative px-8 mt-3">
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
                  className="inline-flex items-center justify-around bg-white dark:bg-black dark:text-white focus:outline-none"
                >
                  {selectedOption}
                  <img src={isDark ? img_bottom_white : img_bottom} alt="선택" />
                </button>
              </div>

              {isOpen && (
                <div className="absolute items-center rounded-[6px] mt-2 shadow-300 z-10 right-8 bg-white dark:bg-black dark:text-white w-[120px] h-[104px]">
                  <div className="flex flex-col p-2 space-y-2 flex-nowrap">
                    {["All", "포스트", "타임캡슐"].map((option) => (
                      <button
                        key={option}
                        onClick={() => selectOption(option)}
                        className={`block w-fulltext-sm text-center hover:bg-bg-100 dark:hover:bg-gray-500 ${
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
            <div
              key={index}
              className="w-full inline-block break-inside-avoid relative mb-[10px] overflow-hidden cursor-pointer rounded-[10px]"
              onClick={() => handleImageClick(item)}
            >
              {getFirstImage(item.title) || item.image ? (
                <>
                  <img
                    src={item.image ? item.image : getFirstImage(item.title)}
                    alt={item.title}
                    className="w-full h-auto rounded-[10px] object-cover"
                  />

                  {item.channel?.name === "CAPSULETEST" && (
                    <>
                      <div className="absolute top-1.5 right-1.5 bg-black bg-opacity-40 w-[30px] h-[30px] flex items-center justify-center rounded-full">
                        <img src={img_capsule} alt="캡슐" className="w-[16px]" />
                      </div>

                      {new Date().toISOString() < (getCloseAt(item.title)?.toISOString() ?? "") && (
                        <div className="absolute inset-0" style={{ backdropFilter: "blur(10px)" }}></div>
                      )}
                    </>
                  )}
                </>
              ) : (
                <div className="w-full h-40 bg-white border border-[#E7E7E7] border-1 rounded-[10px] relative">
                  <div className="px-2.5 py-2.5 text-[16px] ">
                    <p
                      className="overflow-hidden whitespace-pre-wrap text-ellipsis"
                      style={{
                        maxWidth: "calc(30ch)",
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                      }}
                    >
                      {item.title ? getContent(item.title) : "텍스트 없음"}
                    </p>
                  </div>
                </div>
              )}
              {/* {item.channel.name === "TIMECAPSULE" && ( */}
              {item.channel?.name === "CAPSULETEST" && (
                <div className="absolute top-1.5 right-1.5 bg-black bg-opacity-40 w-[30px] h-[30px] flex item-center justify-center rounded-full">
                  <img src={img_capsule} alt="캡슐" className="w-[16px]" />
                </div>
              )}
              <div
                className={`absolute bottom-0 left-0 px-2.5 py-2 w-full text-white rounded-b-[10px] ${item.image || getFirstImage(item.title) ? "bg-custom-gradient" : "bg-[#674EFF]"}`}
              >
                <p
                  className="inline-block font-semibold"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/userinfo/${item.author.fullName}`);
                  }}
                >
                  @{item.author.fullName}
                </p>
                <p className="overflow-hidden text-ellipsis whitespace-nowrap" style={{ maxWidth: "calc(18ch)" }}>
                  {getTitle(item.title)}
                </p>
              </div>
              <div className="absolute bottom-0 right-0 px-2.5 py-2 flex flex-col justify-center items-center space-y-1">
                <img
                  src={likeStatus[item._id] ? img_fillHeart : img_heart}
                  className="object-contain cursor-pointer flex-shrink-0 w-[24px] h-[24px]"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLikeClick(item._id);
                  }}
                />
                {/* {item.channel.name === "TIMECAPSULE" && ( */}
                {item.channel?.name === "CAPSULETEST" && (
                  <img
                    src={
                      new Date().toISOString() >= (getCloseAt(item.title)?.toISOString() ?? "")
                        ? img_noti_disable // 조건을 만족하면 img_noti_disable 사용
                        : notiStatus[item._id]
                          ? img_fillNoti
                          : img_noti
                    }
                    alt="noti"
                    className="object-contain cursor-pointer flex-shrink-0 w-[21px] h-[21px]"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (new Date().toISOString() <= (getCloseAt(item.title)?.toISOString() ?? "")) {
                        handleNotiClick(item._id);
                      }
                    }}
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

      {/* 모달 보여주는 부분 */}
      {showModal && (
        <TimeCapsuleModal
          imgSrc={modalData.imgSrc}
          neonText={modalData.neonText}
          whiteText={modalData.whiteText}
          onClose={handleCloseModal}
        />
      )}

      {showAlarmModal && selectedPostId && (
        <TimeCapsuleModal
          imgSrc={alarmModalData.imgSrc}
          neonText={alarmModalData.neonText}
          whiteText={alarmModalData.whiteText}
          onClose={handleAlarmCloseModal}
          onCancel={handleAlarmCloseModal}
          onConfirm={handleConfirm}
        />
      )}

      {showOpenModal && (
        <TimeCapsuleModal
          imgSrc={openModalData.imgSrc}
          neonText={openModalData.neonText}
          whiteText={openModalData.whiteText}
          whiteTextClick={openModalData.whiteTextClick}
          onClose={handleOpenTCModal}
        />
      )}
    </>
  );
}
