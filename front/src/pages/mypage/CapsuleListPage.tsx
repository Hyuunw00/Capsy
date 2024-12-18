import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

interface CapsuleListPageState {
  title: string; // 제목 (ex. "공개 완료", "공개 대기")
  items: CapsuleItem[]; // 리스트 아이템 배열
  fullName: string;
}
interface CapsuleItem {
  id: string;
  title: string;
  content: string;
  image?: string;
  closeAt: Date;
}

function CapsuleListPage() {
  const location = useLocation();
  console.log(location);

  const { items, fullName, title } = location.state as CapsuleListPageState;

  console.log(items);

  // 페이지 처음 로드 시 스크롤을 맨 위로 이동
  useEffect(() => {
    window.scrollTo(0, 0); // x: 0, y: 0으로 스크롤 초기화
  }, []); // 빈 배열을 의존성으로 전달

  return (
    <div className="capsule-list-page mb-[30px]">
      {/* 작성자 fullName */}
      <div className="py-[30px] pl-[40px]">
        {fullName ? (
          <span>
            <strong>@{fullName}</strong>님이 작성한 타임캡슐
          </span>
        ) : (
          <span>나의 타임캡슐</span>
        )}
      </div>

      {/* 작성자 게시물 사진  */}
      <div className="grid grid-cols-3  ">
        {items.map((item, index) => (
          <div key={index} className=" aspect-square  relative  overflow-hidden">
            {title === "공개 대기" ? (
              <div>
                <img
                  src={item.image}
                  alt={item.title}
                  className={`absolute inset-0 w-full h-full object-cover filter blur-md`} // 공개대기 캡슐이면 blur처리
                />
                <div className="absolute inset-0 flex items-center justify-center backdrop-blur-md bg-black/30">
                  <p className="text-sm text-white">{item.closeAt?.toLocaleDateString()} 공개 예정</p>
                </div>
              </div>
            ) : (
              <Link to={`/detail/${item.id}`}>
                <img
                  src={item.image}
                  alt="첫번째 이미지 썸네일"
                  className={`absolute inset-0 w-full h-full object-cover `} // 공개대기 캡슐이면 blur처리
                />
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default CapsuleListPage;
