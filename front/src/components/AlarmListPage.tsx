import { useLocation } from "react-router-dom";

interface AlarmListPageState {
  items: string[]; // title을 제거하고 items만 사용
}

function AlarmListPage() {
  const location = useLocation();
  const { items } = location.state as AlarmListPageState;

  if (!items || items.length === 0) {
    return <div>아이템이 없습니다.</div>;
  }

  return (
    <div className="alarm-list-page mb-[30px]">
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
