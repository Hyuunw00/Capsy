import { InputWithLabel } from "../../components/InputWithLabel";
import closeIcon from "../../assets/close-black.svg";

interface EditModalProps {
  onClose: () => void;
  onSubmit: (date: { year: string; month: string; day: string }) => void;
}

function EventEditModal({ onClose, onSubmit }: EditModalProps) {
  //   이벤트 종료 기간
  const date = { year: "2024", month: "1", day: "1" };

  const handleSubmit = () => {
    // 모든 검증을 통과한 경우
    onSubmit(date);
    onClose();
  };

  return (
    <div className="absolute top-32 left-12 shadow-md z-50 w-[80%] p-4 bg-white rounded-lg">
      <button className="absolute right-2 top-1" onClick={onClose}>
        <img className="w-[24px] h-[24px] object-contain" src={closeIcon} alt="닫기 버튼" />
      </button>
      <h5 className="mb-3 text-primary">날짜 지정 안내</h5>
      <div className="space-y-4">
        <div className="text-gray-600">타임캡슐 공개 날짜를 지정해주세요.</div>
        <div className="flex flex-col gap-2">
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <InputWithLabel disable={true} label="year" placeholder="year" value={date.year} />
            </div>
            <span className="text-lg text-gray-400">/</span>
            <div className="flex-1">
              <InputWithLabel disable={true} label="month" placeholder="month" value={date.month} />
            </div>
            <span className="text-lg text-gray-400">/</span>
            <div className="flex-1">
              <InputWithLabel disable={true} label="day" placeholder="day" value={date.day} />
            </div>
            <button onClick={handleSubmit} className="px-4 py-2 text-white rounded w-fit bg-primary">
              확인
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventEditModal;
