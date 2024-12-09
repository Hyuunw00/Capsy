import { useRef, useState } from "react";
import { useNavigate } from "react-router";
import NotificationModal from "../../components/NotificationModal";
import loginLogo from "../../assets/login-logo.svg";
import { useSignupStore } from "../../store/signupStore";
import PasswordInput from "./PasswordInput";
import IdInput from "./IdInput";
import EmailInput from "./EmailInput";
import PasswordConfirmInput from "./PasswordConfirmInput";

export default function SignUpPage() {
  const navigate = useNavigate();

  const idRef = useRef<HTMLInputElement | null>(null);
  const emailRef = useRef<HTMLInputElement | null>(null);

  const passwordCorrectref = useRef<HTMLInputElement | null>(null);
  const passwordref = useRef<HTMLInputElement | null>(null);

  const [isOpen, setIsOpen] = useState(false);

  const {
    id,
    email,
    password,
    setId,
    setEmail,
    setPassword,
    setIsIdValid,
    setIsEmailValid,
    setIsPasswordValid,
    isIdValid,
    isEmailValid,
    isPasswordValid,
  } = useSignupStore();

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (passwordref.current?.value !== passwordCorrectref.current?.value) {
      alert("비밀번호가 같지 않습니다!"); // 모달창으로 대체
      setIsPasswordValid(false);
      return;
    }
    if (!isIdValid || !isEmailValid || !isPasswordValid) {
      return;
    }
    setIsOpen(true);
  };

  return (
    <>
      <NotificationModal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <div className="flex flex-col justify-between">
          <div className="text-center mb-[36px] ">
            <h1 className=" font-bold text-[18px]">로그인 성공!</h1>
          </div>

          <div className="text-center">
            <button
              onClick={() => navigate("/signupsuccess")}
              className={`bg-[#674EFF] text-[#ffffff]  w-full  h-[47px] py-[13px] px-[21px] text-[12px] rounded-[6px]`}
            >
              확인
            </button>
          </div>
        </div>
      </NotificationModal>
      <div>
        <div className="w-[600px] h-[441px] px-[19px]">
          <div className="mt-[160px] mb-[26px]">
            <img src={loginLogo} alt="로고" className="block m-auto" />
          </div>

          <div className="flex flex-col gap-[10px]">
            <IdInput />
            <EmailInput />
            <PasswordInput />
            <PasswordConfirmInput />
            <button
              onClick={handleSubmit}
              className=" bg-primary text-[#ffffff]  w-full  h-[47px] py-[13px] px-[21px] text-[12px] rounded-[6px]"
            >
              회원가입
            </button>
          </div>
        </div>

        {/* 버튼 */}
        {/* <div className="flex items-center">
                <button
                  onClick={handleCheckId}
                  className="bg-primary text-[#ffffff] text-center w-[68px] h-[48px] py-[13px] px-[21px] text-[14px] rounded-[6px] flex items-center justify-center"
                >
                  확인
                </button>
              </div>
          <div> */}
      </div>
    </>
  );
}
