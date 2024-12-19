import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/swiper-bundle.css";

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
  onItemClick?: (item: CapsuleItem) => void;
}

function MySlideContainer({ items, uniqueKey, onItemClick }: MySlideContainerProps) {
  const now = new Date();
  return (
    <div className="relative w-full cursor-pointer overflow-hidden px-[30px]">
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
              <div
                className="w-full cursor-pointer"
                onClick={() => onItemClick?.(item)} // 클릭 이벤트
              >
                <div className="relative w-full pb-[100%] bg-gray-200 rounded-[10px] overflow-hidden">
                  {item.image ? (
                    <>
                      <img
                        src={item.image}
                        alt={item.title}
                        className="absolute inset-0 w-full h-full object-cover rounded-[10px]"
                      />
                      {isWaiting && (
                        <div className="absolute inset-0 flex items-center justify-center backdrop-blur-md bg-black/30 scale-130">
                          <p className="text-sm text-white">{item.closeAt?.toLocaleDateString()} 공개 예정</p>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="absolute inset-0 p-3">
                      <p className="text-sm line-clamp-3">{item.content}</p>
                      {isWaiting && (
                        <div className="absolute inset-0 flex items-center justify-center backdrop-blur-md bg-black/30 scale-130">
                          <p className="text-sm text-white">{item.closeAt?.toLocaleDateString()} 공개 예정</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <div className="mt-2 text-[14px] font-pretendard text-left text-black dark:text-white">
                  {item.title}
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
      <button
        className={`absolute left-0 top-1/2 transform -translate-y-[100%] bg-transparent border-none transition-all duration-300 ease-in-out swiper-button-prev-${uniqueKey}`}
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
        className={`absolute right-0 top-1/2 transform -translate-y-[100%] bg-transparent border-none transition-all duration-300 ease-in-out swiper-button-next-${uniqueKey}`}
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
  );
}

export default MySlideContainer;
