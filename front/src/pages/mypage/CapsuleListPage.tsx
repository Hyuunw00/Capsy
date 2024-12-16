import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { getTimeCapsuleChannel, CHANNEL_ID_TIMECAPSULE } from "../../apis/apis";

interface CapsuleListPageState {
  title: string; // 제목 (ex. "공개 완료", "공개 대기")
  items: string[]; // 리스트 아이템 배열
}

function CapsuleListPage() {
  const location = useLocation();
  const { items } = location.state as CapsuleListPageState;

  // 페이지 처음 로드 시 스크롤을 맨 위로 이동
  useEffect(() => {
    window.scrollTo(0, 0); // x: 0, y: 0으로 스크롤 초기화
  }, []); // 빈 배열을 의존성으로 전달

  return (
    <div className="capsule-list-page mt-[30px] mb-[30px]">
      <div className="grid grid-cols-3 gap-[10px] px-[30px]">
        {items.map((item, index) => (
          <div key={index} className="w-full aspect-square bg-gray-200 rounded-[10px] flex justify-center items-center">
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

export default CapsuleListPage;
