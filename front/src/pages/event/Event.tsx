import { useEffect, useState } from "react";
import axiosInstance from "../../apis/axiosInstance";
import NotificationModal from "../../components/NotificationModal";
import { useNavigate } from "react-router";
import { tokenService } from "../../utils/token";
import { useLoginStore } from "../../store/loginStore";
import eventBanner from "../../assets/holiday-event-banner.png";
import eventTimecapsuleThumbnail from "../../assets/event-timeCapsule-thumbnail.png";
import img_heart from "../../assets/Heart_Curved.svg";
import img_fillHeart from "../../assets/heart-fill.svg";
import img_noti from "../../assets/Notification-white.svg";
import img_fillNoti from "../../assets/Notification-fill.svg";
import { CHANNEL_ID_EVENT } from "../../apis/apis";
import Loading from "../../components/Loading";

import eventWriteIcon from "../../assets/event-capsule-icon.svg";
import TimeCapsuleModal from "../../components/TimeCapsuleModal";
import img_lock_timeCapsule from "../../assets/time-capsule-lock.png";

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

export default function Event() {
  // 로그아웃 기능구현을 위해 임시 저장(나중에 삭제)
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const logout = useLoginStore((state) => state.logout);

  // 로딩중인지에 대한 상태
  const [loading, setLoading] = useState<boolean>(true);

  // 이벤트 타임 캡슐 데이터
  const [eventCapsuleData, setEventCapsuleData] = useState<Post[]>([]);

  // 타입 캡슐 버튼 클릭시 모달
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState({ imgSrc: "", neonText: "", whiteText: "" });

  // 각 게시물 좋아요, 알림 상태 관리
  const [userData, _] = useState(() => {
    const storedUserData = sessionStorage.getItem("user");
    return storedUserData ? JSON.parse(storedUserData) : { likes: [] };
  });

  // 공개 대기 캡슐 아이템 예시
  const [likeStatus, setLikeStatus] = useState<{ [key: string]: boolean }>({});
  const [notiStatus, setNotiStatus] = useState<boolean[]>([]);

  // 로그아웃 모달
  const handleClcik = () => {
    setIsOpen(true);
  };

  // 좋아요 버튼 클릭 이벤트 핸들러
  const handleLikeClick = async (postId: string) => {
    const userId = userData._id;

    // 캡슐 데이터와 클릭한 post id 비교
    const post = eventCapsuleData.find((post) => post._id === postId);

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
    } catch (error: any) {
      // console.error("좋아요 처리 실패: ", error);
      if (error.response && error.response.status === 401) {
        console.log("좋아요 처리 실패: 로그인이 필요합니다.");
        navigate("/login");
      }
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

  // 파싱된 title 필드 가져오기
  const getParsedData = (jsonString: any) => {
    try {
      const parsedData = JSON.parse(jsonString);
      return parsedData || jsonString;
    } catch (error) {
      // 기존의 데이터가 잘못 들어가있어 console을 잡아먹어 주석 처리
      // console.error("JSON parse error: ", error);
      return jsonString;
    }
  };

  //  이벤트 캡슐 게시글 이동 버튼
  const handleClickEventEdit = () => {
    navigate("/eventeditor");
  };
  const handleLogout = async () => {
    try {
      await axiosInstance.post("/logout");
      navigate("/");
      logout();
      tokenService.clearAll();
    } catch (error) {
      console.error(error);
    }
  };

  // 포스트 컴포넌트 클릭 시
  const handleImageClick = (item: any) => {
    setModalData({
      imgSrc: img_lock_timeCapsule,
      neonText: "미개봉 이벤트 타임 캡슐입니다!",
      whiteText: "예약 시 알림을 받을 수 있어요",
    });
    setShowModal(true);
  };

  // 타임캡슐 모달 컴포넌트 X 버튼 클릭 시
  const handleCloseModal = () => {
    setShowModal(false);
  };

  // 데이터 call
  useEffect(() => {
    const updateData = async (eventCapsuleChannelId: string) => {
      try {
        const capsuleResponse = await axiosInstance.get(`/posts/channel/${eventCapsuleChannelId}`);
        setEventCapsuleData(capsuleResponse.data);
      } catch (error) {
        console.error("Error: ", error);
      } finally {
        setLoading(false);
      }
    };
    updateData(CHANNEL_ID_EVENT);
  }, []);

  // 좋아요 상태 바뀌면 실행
  useEffect(() => {
    const updatedFilterData = eventCapsuleData.map((post) => {
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
  }, [eventCapsuleData]);

  if (loading) return <Loading />;

  return (
    <>
      {isOpen && (
        <NotificationModal isOpen={isOpen} title="알림" description="로그아웃 하시겠습니까?">
          <div>
            <button onClick={() => setIsOpen(false)}>취소</button>
            <button onClick={handleLogout}>확인</button>
          </div>
        </NotificationModal>
      )}
      {showModal && (
        <TimeCapsuleModal
          imgSrc={modalData.imgSrc}
          neonText={modalData.neonText}
          whiteText={modalData.whiteText}
          onClose={handleCloseModal}
        />
      )}

      {/* 이벤트 배너 */}
      <img className="w-[600px] h-[500px]  " src={eventBanner} alt="이벤트 배너" />

      <div className="relative">
        {/* 캡슐 제목 */}
        <div className="flex justify-between items-center text-[14px] font-pretendard px-[30px]">
          <div className="flex items-center">
            <span className="text-[16px] font-pretendard font-semibold">크리스마스 타임 캡슐</span>
          </div>
        </div>
        {/* 캡슐 목록 */}
        <div className="w-[600px] p-5">
          <div className="grid grid-cols-3 gap-[10px]">
            {eventCapsuleData.map((item, index) => (
              <div
                key={index}
                className="flex flex-col rounded-[10px] items-center justify-center cursor-pointer"
                onClick={handleImageClick}
              >
                <div
                  className="w-full inline-block break-inside-avoid relative  overflow-hidden cursor-pointer"
                  // 모달창
                >
                  <div>
                    {/*  게시물 이미지 */}
                    <img
                      src={
                        // getParsedData(item.title)?.image
                        //   ? //  제일 첫번째 이미지 썸네일로 보여주기
                        //     getParsedData(item.title).image[0]
                        //   : eventTimecapsuleThumbnail
                        eventTimecapsuleThumbnail
                      }
                      alt="이벤트 타입캡슐 로고"
                      className="w-full h-auto  object-cover rounded-t-[10px]"
                    />
                  </div>

                  <div className="absolute bottom-0 right-0 px-2.5 py-2 flex flex-col justify-center items-center space-y-1">
                    {/* 좋아요 이미지 */}
                    <img
                      src={likeStatus[item._id] ? img_fillHeart : img_heart}
                      className="object-contain cursor-pointer flex-shrink-0 w-[24px] h-[24px]"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLikeClick(item._id);
                      }}
                    />
                    {/* {item.channel.name === "TIMECAPSULE" && ( */}
                    {item.channel?.name === "EVENTTEST" && (
                      //  알림 이미지
                      <img
                        src={notiStatus[index] ? img_fillNoti : img_noti}
                        alt="noti"
                        className="object-contain cursor-pointer flex-shrink-0 w-[21px] h-[21px]"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleNotiClick(index);
                        }}
                      />
                    )}
                  </div>
                </div>
                {/* 게시글 작성자 및 제목 가져오기 */}
                <div className={` bottom-0 left-0 px-2.5 py-2 w-full text-white rounded-b-[10px]  bg-custom-gradient `}>
                  <p
                    className="inline-block font-semibold"
                    onClick={(e) => {
                      navigate(`/userInfo/${item.author.fullName}`);
                      e.stopPropagation();
                      console.log("누른 아이디: ", item.author.fullName);
                    }}
                  >
                    @{item.author.fullName}
                  </p>
                  <p className="overflow-hidden text-ellipsis whitespace-nowrap" style={{ maxWidth: "calc(18ch)" }}>
                    {getParsedData(item.title).title}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* 이벤트 캡슐 게시글 작성 버튼 */}
        <div className="fixed bottom-[80px] right-6 z-50">
          <button
            className="bg-black w-[72px] h-[72px] rounded-[36px] flex justify-center items-center"
            onClick={handleClickEventEdit}
          >
            <img src={eventWriteIcon} alt="이벤트 캡슐 작성 버튼" className="w-[40px] h-[40px]" />
          </button>
        </div>
      </div>

      <div>
        <button onClick={handleClcik}>logout</button>
      </div>
    </>
  );
}
