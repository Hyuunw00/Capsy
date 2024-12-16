import { useEffect } from "react";
import { useLocation } from "react-router-dom";

interface AlarmListPageState {
  items: string[]; // title을 제거하고 items만 사용
}

function AlarmListPage() {
  const location = useLocation();
  const { items } = location.state as AlarmListPageState;

  // 페이지가 처음 렌더링될 때 화면 맨 위로 스크롤
  useEffect(() => {
    window.scrollTo(0, 0); // x축: 0, y축: 0으로 이동
  }, []); // 빈 배열을 의존성으로 전달하여 컴포넌트 최초 마운트 시 실행

  if (!items || items.length === 0) {
    return <div>아이템이 없습니다.</div>;
  }

  return (
    <div className="alarm-list-page mt-[30px] mb-[30px]">
      {/* 제목을 출력하지 않음 */}
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

export default AlarmListPage;
