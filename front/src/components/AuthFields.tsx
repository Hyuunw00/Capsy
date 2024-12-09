import { useRef, useState } from "react";
import NotificationModal from "./NotificationModal";
import { useNavigate } from "react-router";

interface AuthFieldsProps {
  enName: string;
  name: string;
  type: string;
  onCheck: (isValid: boolean) => void;
}
export default function AuthFields({ enName, name, type, onCheck }: AuthFieldsProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [color, setColor] = useState<string | null>(null);
  const [borderColor, setBorderColor] = useState("#CBD5E1");

  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleCheck = () => {
    const value = inputRef.current?.value.trim();
    const Regex = type === "email" ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/ : /^[a-zA-Z0-9]{4,12}$/;
    const isValid = value && Regex.test(value);
    if (!isValid) {
      setMessage(`사용 불가능한 ${name} 입니다!`);
      onCheck(false);
      setBorderColor("#ef4444");
      setColor("text-red-500");
      setIsOpen(true);
    } else {
      setMessage(`사용 가능한 ${name}입니다!`);
      onCheck(true);
      setBorderColor("#CBD5E1");
      setColor("text-gray-500");
      setIsOpen(false);
    }
  };
  return (
    <>
      <NotificationModal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <div className="flex flex-col justify-between">
          <div className="text-center mb-[36px] ">
            <h1 className=" font-bold text-[18px]">이미 존재하는 {name}입니다!</h1>
          </div>

          <div className="text-center">
            <button
              onClick={() => navigate("/signup")}
              className={`bg-[#674EFF] text-[#ffffff]  w-full  h-[47px] py-[13px] px-[21px] text-[12px] rounded-[6px]`}
            >
              확인
            </button>
          </div>
        </div>
      </NotificationModal>
      <div>
        <label htmlFor={enName} className="text-[10px] mb-[5px]">
          {name}
        </label>
        <div className="flex items-center gap-[6px] ">
          <input
            id={enName}
            type={type}
            placeholder={name}
            style={{ borderColor: `${borderColor}` }}
            className={`w-[526px] h-[48px] px-[12px] py-[14px] rounded-[6px] border`}
            ref={inputRef}
          />
          <button
            className="bg-[#674EFF] text-[#ffffff] w-[68px] h-[47px] py-[13px] px-[21px] text-[12px] rounded-[6px]"
            onClick={handleCheck}
          >
            확인
          </button>
        </div>
        {message && <span className={`text-[12px] ${color}`}>{message}</span>}
      </div>
    </>
  );
}
