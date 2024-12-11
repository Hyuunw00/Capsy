import { useLocation } from "react-router-dom";

interface CapsuleListPageState {
  title: string; // 제목 (ex. "공개 완료", "공개 대기")
  items: string[]; // 리스트 아이템 배열
}

function CapsuleListPage() {
  const location = useLocation();
  const { items } = location.state as CapsuleListPageState;

  return (
    <div className="capsule-list-page">
      <div className="grid grid-cols-3 gap-4 px-4">
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
