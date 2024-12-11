import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/swiper-bundle.css";

import leftArrowCircle from "../assets/leftArrowCircle.svg";
import rightArrowCircle from "../assets/rightArrowCircle.svg";

interface MySlideContainerProps {
  items: string[]; // 전체 아이템 배열
  uniqueKey: string; // 고유한 키 추가 (공개완료와 공개대기 구분)
}

function MySlideContainer({ items, uniqueKey }: MySlideContainerProps) {
  const visibleItems = items.slice(0, 8); // 슬라이드로 보여줄 8개만 잘라내기

  return (
    <div className="relative w-full overflow-hidden px-[30px]">
      <Swiper
        key={uniqueKey} // 고유한 키로 각 슬라이더 인스턴스를 구분
        modules={[Navigation]}
        spaceBetween={10}
        slidesPerView={3}
        navigation={{
          prevEl: `.swiper-button-prev-${uniqueKey}`, // 고유한 이전 버튼
          nextEl: `.swiper-button-next-${uniqueKey}`, // 고유한 다음 버튼
        }}
        style={{ width: "100%", height: "auto" }}
      >
        {visibleItems.map((item, index) => (
          <SwiperSlide key={index} className="flex justify-center items-center">
            <div className="w-full">
              {/* 정사각형 컨테이너 */}
              <div className="relative w-full pb-[100%] bg-gray-200 rounded-[10px]"></div>
              {/* 텍스트 */}
              <div className="mt-2 text-[14px] font-pretendard text-left">{item}</div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* 커스텀 화살표 버튼 */}
      <button
        className={`absolute left-0 top-1/2 transform -translate-y-1/2 bg-transparent border-none transition-all duration-300 ease-in-out swiper-button-prev-${uniqueKey}`}
        aria-label="Previous slide"
      >
        <img src={leftArrowCircle} className="w-[24px] h-[24px]" />
      </button>
      <button
        className={`absolute right-0 top-1/2 transform -translate-y-1/2 bg-transparent border-none transition-all duration-300 ease-in-out swiper-button-next-${uniqueKey}`}
        aria-label="Next slide"
      >
        <img src={rightArrowCircle} className="w-[24px] h-[24px]" />
      </button>
    </div>
  );
}

export default MySlideContainer;
