import { useState } from "react";
import { useSignupStore } from "../../store/signupStore";
import NoticeModal from "../../components/NoticeModal";
import { userLists } from "../../apis/auth";

export default function EmailInputWithButton() {
  const { email, setEmail, isEmailValid, setIsEmailValid } = useSignupStore();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const [isOpen, setIsOpen] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setEmail(newEmail); // 상태 업데이트
  };
  const handleCheckEmail = async () => {
    const { data } = await userLists();
    const isExist = data.find((user: UserLists) => user.email === email);
    if (isExist) {
      setIsOpen(true);
      setIsEmailValid(false);
      return;
    }
    setIsEmailValid(emailRegex.test(email));
  };

  return (
    <>
      {isOpen && (
        <NoticeModal title="알림" onClose={() => setIsOpen(false)}>
          <p>이미 존재하는 이메일입니다.</p>
        </NoticeModal>
      )}
      <div className="flex items-center gap-2 w-full">
        <div className="flex-1">
          <label htmlFor="email" className="text-[10px] mb-[5px]">
            이메일
          </label>
          <input
            id="email"
            type="email"
            value={email}
            placeholder="이메일"
            onChange={handleChange}
            className={`w-full  h-[48px] px-[12px] py-[14px] rounded-[6px] border  ${!isEmailValid && "border-red-500 "}`}
          />
          <span className={`text-[12px] h-[16px]  ${isEmailValid ? "text-gray-500 " : "text-red-500 "}`}>
            {isEmailValid ? "유효한 이메일입니다!" : "이메일 형식"}
          </span>
        </div>

        <div className="flex items-center">
          <button
            onClick={handleCheckEmail}
            className="bg-primary text-[#ffffff] text-center w-[68px] h-[48px] py-[13px] px-[21px] text-[14px] rounded-[6px] flex items-center justify-center"
          >
            확인
          </button>
        </div>
      </div>
    </>
  );
}
