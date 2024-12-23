import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/swiper-bundle.css";
import img_lock_timeCapsule from "../../assets/time-capsule-lock.png";
import { Link, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import TimeCapsuleModal from "../../components/TimeCapsuleModal";
import axiosInstance from "../../apis/axiosInstance";
import img_noti from "../../assets/Notification-white.svg";
import img_fillNoti from "../../assets/Notification-fill.svg";
import { createNotifications } from "../../apis/apis";
export interface CapsuleItem {
  id: string;
  title: string;
  content: string;
  image?: string;
  closeAt: Date;
  likes: Like[];
  author: Author;
  channel: Channel;
}

interface SlideContainerProps {
  items: CapsuleItem[];
  uniqueKey: string;
}
function SlideContainer({ items, uniqueKey }: SlideContainerProps) {
  const navigate = useNavigate();
  // 모달 상태관리
  const [modalData, setModalData] = useState({ imgSrc: "", neonText: "", whiteText: "" });
  const [showModal, setShowModal] = useState(false);

  const handleClickCapsule = () => {
    setModalData({
      imgSrc: img_lock_timeCapsule,
      neonText: "미개봉 타임 캡슐입니다!",
      whiteText: "예약 시 알림을 받을 수 있어요",
    });
    setShowModal(true);
  };

  // 공개 대기 캡슐 아이템 예시
  const [likeStatus, setLikeStatus] = useState<{ [key: string]: boolean }>({});
  const [notiStatus, setNotiStatus] = useState<boolean[]>([]);

  // 각 게시물 좋아요, 알림 상태 관리
  const [userData, _] = useState(() => {
    const storedUserData = sessionStorage.getItem("user");
    return storedUserData ? JSON.parse(storedUserData) : { likes: [] };
  });

  // 좋아요 버튼 클릭 이벤트 핸들러
  const handleLikeClick = async (postId: string) => {
    const userId = userData._id;

    // 캡슐 데이터와 클릭한 post id 비교
    const post = items.find((post) => post.id === postId);

    console.log(post, userId);

    // 포스트 없으면 return
    if (!post) return;

    // 유저가 해당 게시글 좋아요 눌렀었는지 확인
    const userLikes = post?.likes.filter((like) => like.user === userId);

    try {
      // 좋아요를 누르지 않았다면 추가
      if (userLikes.length === 0) {
        const likeResponse = await axiosInstance.post("/likes/create", { postId });
        const newLike = {
          _id: likeResponse.data._id,
          post: postId,
          user: userId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        post.likes.push(newLike);
        console.log("좋아요 추가 완료!", post.likes);
        setLikeStatus((prevState) => ({ ...prevState, [postId]: true }));

        // 작성자가 자신의 게시글에 좋아요를 누를때는 알림  x
        if (post.author._id === userId) return;

        // 좋아요 알림 생성
        await createNotifications({
          notificationType: "LIKE",
          notificationTypeId: likeResponse.data._id,
          userId: post.author._id,
          postId: post.id,
        });
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

  // 좋아요 상태 바뀌면 실행
  useEffect(() => {
    const updatedFilterData = items.map((post) => {
      const isLiked = post.likes.some((like) => like.user === userData._id);
      return {
        ...post,
        isLiked, // 좋아요 상태 업데이트
      };
    });
    const newLikeStatus = updatedFilterData.reduce<{ [key: string]: boolean }>((acc, post) => {
      acc[post.id] = post.isLiked;
      return acc;
    }, {});
    setLikeStatus(newLikeStatus);
  }, [items]);

  return (
    <>
      {/* 공개 대기 캡슐 클릭시 */}
      {showModal && (
        <TimeCapsuleModal
          imgSrc={modalData.imgSrc}
          neonText={modalData.neonText}
          whiteText={modalData.whiteText}
          onClose={() => setShowModal(false)}
        />
      )}

      <div className="relative w-full overflow-hidden px-[30px]">
        <Swiper
          key={uniqueKey}
          modules={[Navigation]}
          spaceBetween={10}
          slidesPerView={3}
          navigation={{
            prevEl: `.swiper-button-prev-${uniqueKey}`,
            nextEl: `.swiper-button-next-${uniqueKey}`,
          }}
          style={{ width: "100%", height: "auto" }}
        >
          {items.map((item, index) => {
            const isWaiting = item.closeAt && item.closeAt > new Date();
            return (
              <SwiperSlide key={item.id} className="flex items-center justify-center">
                <div className="w-full">
                  {/* 이미지 */}
                  <div className="relative w-full pb-[100%] bg-gray-200 rounded-[10px] overflow-hidden">
                    {isWaiting ? (
                      <div onClick={handleClickCapsule} className="cursor-pointer">
                        <div>
                          <img
                            src={item.image}
                            alt={item.title}
                            className="absolute inset-0 w-full h-full object-cover rounded-[10px] "
                          />

                          <div className="absolute inset-0 flex items-center justify-center backdrop-blur-md bg-black/30 scale-130">
                            <p className="text-sm text-white">{item.closeAt?.toLocaleDateString()} 공개 예정</p>
                          </div>
                        </div>
                        <div className="absolute bottom-0 right-0 px-2.5 py-2 flex flex-col justify-center items-center space-y-1">
                          {item.channel.name === "TIMECAPSULE" && (
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
                    ) : (
                      <Link to={`/detail/${item.id}`}>
                        <div>
                          <img
                            src={item.image}
                            alt={item.title}
                            className="absolute inset-0 w-full h-full object-cover rounded-[10px] "
                          />
                        </div>
                      </Link>
                    )}
                  </div>
                  {/* 타이틀 */}
                  <div className="mt-2 text-[14px] font-pretendard text-left truncate text-black dark:text-white">
                    {item.title}
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
        {/* 커스텀 화살표 버튼 */}
        <button
          className={`absolute left-[5px] top-1/2 transform -translate-y-[100%] bg-transparent border-none transition-all duration-300 ease-in-out swiper-button-prev-${uniqueKey}`}
          aria-label="Previous slide"
        >
          <svg width="20" height="20" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              className="fill-primary dark:fill-primary-dark"
              d="M15 7.5C15 11.6421 11.6421 15 7.5 15C3.35786 15 0 11.6421 0 7.5C0 3.35786 3.35786 0 7.5 0C11.6421 0 15 3.35786 15 7.5Z"
            />
            <path
              className="fill-white dark:fill-black"
              d="M6.7675 7.5L9.86125 10.5938L8.9775 11.4775L5 7.5L8.9775 3.5225L9.86125 4.40625L6.7675 7.5Z"
            />
          </svg>
        </button>

        <button
          className={`absolute right-[5px] top-1/2 transform -translate-y-[100%] bg-transparent border-none transition-all duration-300 ease-in-out swiper-button-next-${uniqueKey}`}
          aria-label="Next slide"
        >
          <svg width="20" height="20" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              className="fill-primary dark:fill-primary-dark"
              d="M15 7.5C15 11.6421 11.6421 15 7.5 15C3.35786 15 0 11.6421 0 7.5C0 3.35786 3.35786 0 7.5 0C11.6421 0 15 3.35786 15 7.5Z"
            />
            <path
              className="fill-white dark:fill-black"
              d="M9.2325 7.5L6.13875 4.40625L7.0225 3.5225L11 7.5L7.0225 11.4775L6.13875 10.5938L9.2325 7.5Z"
            />
          </svg>
        </button>
      </div>
    </>
  );
}
export default SlideContainer;
