import { InputWithLabel } from "../../components/InputWithLabel";

interface EditModalProps {
  onClose: () => void;
  onSubmit: (date: { year: string; month: string; day: string }) => void;
}

function EventEditModal({ onClose, onSubmit }: EditModalProps) {
  //   이벤트 종료 기간
  const date = { year: "2025", month: "1", day: "1" };

  const handleSubmit = () => {
    // 모든 검증을 통과한 경우
    onSubmit(date);
    onClose();
  };

  return (
    <div className="absolute top-32 left-12 shadow-md z-50 w-[80%] p-4 bg-white dark:bg-gray-600 rounded-lg">
      <button className="absolute right-2 top-1" onClick={onClose}>
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="fill-black dark:fill-white"
        >
          <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" />
        </svg>
      </button>
      <h5 className="mb-3 text-primary dark:text-secondary">날짜 지정 안내</h5>
      <div className="space-y-4">
        <div className="text-gray-600 dark:text-gray-50">타임캡슐 공개 날짜를 지정해주세요.</div>
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
            <button
              onClick={handleSubmit}
              className="px-4 py-2 text-white rounded w-fit bg-primary dark:text-black dark:bg-secondary"
            >
              확인
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventEditModal;
