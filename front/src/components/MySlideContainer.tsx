import { useState } from "react";
import leftArrowCircle from "../assets/leftArrowCircle.svg";
import rightArrowCircle from "../assets/rightArrowCircle.svg";

interface MySlideContainerProps {
  items: string[];
}

function MySlideContainer({ items }: MySlideContainerProps) {
  const [slideIndex, setSlideIndex] = useState(0);
  const maxIndex = Math.floor(items.length / 3);

  const handleSlide = (direction: "left" | "right") => {
    if (direction === "left") setSlideIndex((prev) => Math.max(prev - 1, 0));
    else setSlideIndex((prev) => Math.min(prev + 1, maxIndex));
  };

  return (
    <div className="px-[30px] relative w-full">
      <div className="overflow-hidden w-full">
        <div
          className="flex transition-transform duration-300"
          style={{ transform: `translateX(-${slideIndex * (100 / 3)}%)` }}
        >
          {items.map((item, index) => (
            <div key={index} className="flex-shrink-0 w-1/3 h-auto flex flex-col m-2 pb-6">
              {/* 정사각형 */}
              <div className="relative w-full pb-[100%] bg-gray-200 rounded-[10px]"></div>

              {/* 텍스트 */}
              <div className="mt-2 text-[14px] font-pretendard text-left">{item}</div>
            </div>
          ))}
        </div>
      </div>
      <button
        className={`absolute left-0 top-1/2 transform -translate-y-[36px] px-[30px] py-1 ${
          slideIndex === 0 ? "cursor-not-allowed" : ""
        }`}
        onClick={() => handleSlide("left")}
        disabled={slideIndex === 0}
      >
        <img src={leftArrowCircle} alt="왼쪽 화살표" />
      </button>
      <button
        className={`absolute right-0 top-1/2 transform -translate-y-[36px] px-[30px] py-1 ${
          slideIndex === maxIndex ? "cursor-not-allowed" : ""
        }`}
        onClick={() => handleSlide("right")}
        disabled={slideIndex === maxIndex}
      >
        <img src={rightArrowCircle} alt="오른쪽 화살표" />
      </button>
    </div>
  );
}

export default MySlideContainer;
