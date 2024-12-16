import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/swiper-bundle.css";
import leftArrowCircle from "../../assets/leftArrowCircle.svg";
import rightArrowCircle from "../../assets/rightArrowCircle.svg";
interface CapsuleItem {
  id: string;
  title: string;
  content: string;
  image?: string;
  closeAt?: Date;
}
interface MySlideContainerProps {
  items: CapsuleItem[];
  uniqueKey: string;
}
function MySlideContainer({ items, uniqueKey }: MySlideContainerProps) {
  const now = new Date();
  return (
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
        {items.map((item) => {
          const isWaiting = item.closeAt && item.closeAt > now;
          return (
            <SwiperSlide key={item.id} className="flex items-center justify-center">
              <div className="w-full">
                {/* 이미지 또는 콘텐츠 박스 */}
                <div className="relative w-full pb-[100%] bg-gray-200 rounded-[10px] overflow-hidden">
                  {item.image ? (
                    <>
                      <img
                        src={item.image}
                        alt={item.title}
                        className="absolute inset-0 w-full h-full object-cover rounded-[10px]"
                      />
                      {isWaiting && (
                        <div className="absolute inset-0 flex items-center justify-center backdrop-blur-md bg-black/30">
                          <p className="text-sm text-white">{item.closeAt?.toLocaleDateString()} 공개 예정</p>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="absolute inset-0 p-3">
                      <p className="text-sm line-clamp-3">{item.content}</p>
                      {isWaiting && (
                        <div className="absolute inset-0 flex items-center justify-center backdrop-blur-md bg-black/30">
                          <p className="text-sm text-white">{item.closeAt?.toLocaleDateString()} 공개 예정</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                {/* 타이틀 */}
                <div className="mt-2 text-[14px] font-pretendard text-left">{item.title}</div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
      {/* 커스텀 화살표 버튼 */}
      <button
        className={`absolute left-0 top-1/2 transform -translate-y-[100%] bg-transparent border-none transition-all duration-300 ease-in-out swiper-button-prev-${uniqueKey}`}
        aria-label="Previous slide"
      >
        <img src={leftArrowCircle} className="w-[24px] h-[24px]" alt="Previous" />
      </button>
      <button
        className={`absolute right-0 top-1/2 transform -translate-y-[100%] bg-transparent border-none transition-all duration-300 ease-in-out swiper-button-next-${uniqueKey}`}
        aria-label="Next slide"
      >
        <img src={rightArrowCircle} className="w-[24px] h-[24px]" alt="Next" />
      </button>
    </div>
  );
}
export default MySlideContainer;