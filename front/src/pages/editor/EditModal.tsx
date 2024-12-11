import { useState } from "react";
import { InputWithLabel } from "../../components/InputWithLabel";
import closeIcon from "../../assets/close-black.svg";

interface EditModalProps {
  onClose: () => void;
  onSubmit: (date: { year: string; month: string; day: string }) => void;
}

interface ValidationisErrors {
  year?: string;
  month?: string;
  day?: string;
}

function EditModal({ onClose, onSubmit }: EditModalProps) {
  const [date, setDate] = useState({
    year: "",
    month: "",
    day: "",
  });
  const [isErrors, setisErrors] = useState<ValidationisErrors>({});

  const validateInput = (name: string, value: string) => {
    const numValue = parseInt(value);
    const today = new Date();
    const currentYear = today.getFullYear();
  
    switch (name) {
      case "year":
        if (!/^\d{4}$/.test(value)) {
          return "연도는 4자리 숫자여야 합니다";
        }
        if (numValue < currentYear) {
          return "현재 연도보다 이전의 연도는 선택할 수 없습니다";
        }
        break;
      case "month":
        if (!/^\d{1,2}$/.test(value)) {
          return "월은 2자리 이내의 숫자여야 합니다";
        }
        if (numValue < 1 || numValue > 12) {
          return "월은 1 ~ 12 사이여야 합니다";
        }
        break;
      case "day":
        if (!/^\d{1,2}$/.test(value)) {
          return "날짜는 2자리 이내의 숫자여야 합니다";
        }
        if (numValue < 1 || numValue > 31) {
          return "날짜는 1 ~ 31 사이여야 합니다";
        }
        break;
    }
  
    // 날짜가 모두 입력된 경우 전체 날짜 유효성 검사
    if (date.year && date.month && date.day) {
      const selectedDate = new Date(
        parseInt(date.year),
        parseInt(date.month) - 1,
        parseInt(date.day)
      );
      
      // 선택된 날짜가 오늘보다 이전인 경우
      if (selectedDate < today) {
        switch(name) {
          case "year":
            return "미래의 날짜를 선택해주세요";
          case "month":
            if (parseInt(date.year) === currentYear) {
              return "미래의 날짜를 선택해주세요";
            }
            break;
          case "day":
            if (parseInt(date.year) === currentYear && 
                parseInt(date.month) === (today.getMonth() + 1)) {
              return "미래의 날짜를 선택해주세요";
            }
            break;
        }
      }
    }
  
    return "";
  };

  const handleInputChange = (name: string, value: string) => {
    // 숫자만 입력 허용
    if (!/^\d*$/.test(value)) {
      return;
    }

    if (name === "year" && value.length > 4) return;
    if ((name === "month" || name === "day") && value.length > 2) return;

    setDate((prev) => ({ ...prev, [name]: value }));

    const isError = validateInput(name, value);
    setisErrors((prev) => ({
      ...prev,
      [name]: isError,
    }));
  };

  const handleSubmit = () => {
    const newisErrors: ValidationisErrors = {};
    let hasisErrors = false;

    Object.entries(date).forEach(([name, value]) => {
      const isError = validateInput(name, value);
      if (isError) {
        newisErrors[name as keyof ValidationisErrors] = isError;
        hasisErrors = true;
      }
    });

    if (!date.year || !date.month || !date.day) {
      hasisErrors = true;
      if (!date.year) newisErrors.year = "연도를 입력해주세요";
      if (!date.month) newisErrors.month = "월을 입력해주세요";
      if (!date.day) newisErrors.day = "일을 입력해주세요";
    }

    setisErrors(newisErrors);

    if (!hasisErrors) {
      onClose();
      onSubmit(date);
    }
  };

  // 첫 번째 에러 메시지 가져오기
  const getisErrorMessage = () => {
    const isErrorMessages = Object.values(isErrors).filter((isError) => isError);
    return isErrorMessages[0] || "";
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
              <InputWithLabel
                label="year"
                placeholder="year"
                value={date.year}
                onChange={(e) => handleInputChange("year", e.target.value)}
                isError={Boolean(isErrors.year)}
              />
            </div>
            <span className="text-lg text-gray-400">/</span>
            <div className="flex-1">
              <InputWithLabel
                label="month"
                placeholder="month"
                value={date.month}
                onChange={(e) => handleInputChange("month", e.target.value)}
                isError={Boolean(isErrors.month)}
              />
            </div>
            <span className="text-lg text-gray-400">/</span>
            <div className="flex-1">
              <InputWithLabel
                label="day"
                placeholder="day"
                value={date.day}
                onChange={(e) => handleInputChange("day", e.target.value)}
                isError={Boolean(isErrors.day)}
              />
            </div>
            <button onClick={handleSubmit} className="px-4 py-2 text-white rounded w-fit bg-primary">
              확인
            </button>
          </div>
          {getisErrorMessage() && <div className="text-sm text-red-500">{getisErrorMessage()}</div>}
        </div>
      </div>
    </div>
  );
}

export default EditModal;
