import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import img_lock_timeCapsule from "../../assets/time-capsule-lock.png";
import TimeCapsuleModal from "../../components/TimeCapsuleModal";
import digging from "../../assets/digging.gif";

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

  const { items, fullName, title } = location.state as CapsuleListPageState;

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
  console.log(items);

  // 페이지 처음 로드 시 스크롤을 맨 위로 이동
  useEffect(() => {
    window.scrollTo(0, 0); // x: 0, y: 0으로 스크롤 초기화
  }, []); // 빈 배열을 의존성으로 전달

  return (
    <>
      {showModal && (
        <TimeCapsuleModal
          imgSrc={modalData.imgSrc}
          neonText={modalData.neonText}
          whiteText={modalData.whiteText}
          onClose={() => setShowModal(false)}
        />
      )}
      <div className="capsule-list-page mb-[30px]">
        <div className="py-[30px] pl-[40px] dark:text-white">
          {fullName ? (
            <span>
              <strong>@{fullName}</strong>님이 작성한 타임캡슐
            </span>
          ) : (
            <span>나의 타임캡슐</span>
          )}
        </div>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
            <img src={digging} alt="digging" className="w-[100px] h-[100px]" />
            <p className="text-gray-300 dark:text-gray-400 text-lg">타임캡슐이 존재하지 않습니다.</p>
          </div>
        ) : (
          <div className="grid grid-cols-3">
            {items.map((item, index) => (
              <div key={index} className=" aspect-square  relative  overflow-hidden">
                {title === "공개 대기" ? (
                  <div onClick={handleClickCapsule} className="cursor-pointer">
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
        )}
      </div>
    </>
  );
}

export default CapsuleListPage;
