import { useState } from "react";
import { useNavigate } from "react-router";
import NotificationModal from "../../components/NotificationModal";
import loginLogo from "../../assets/login-logo.svg";
import { useSignupStore } from "../../store/signupStore";
import PasswordInput from "./PasswordInput";
import IdInput from "./IdInput";
import EmailInput from "./EmailInput";
import PasswordConfirmInput from "./PasswordConfirmInput";
import axiosInstance from "../../apis/axiosInstance";

export default function SignUpPage() {
  const navigate = useNavigate();
  const [success, setSuccess] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const { isIdValid, isEmailValid, isPasswordValid, isPasswordConfirmValid } = useSignupStore();
  const id = useSignupStore((state) => state.id);
  const email = useSignupStore((state) => state.email);
  const password = useSignupStore((state) => state.password);

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      if (!isIdValid || !isEmailValid || !isPasswordValid || !isPasswordConfirmValid) {
        setSuccess("입력 값을 확인해주세요!");
        setIsOpen(true);
        return;
      }
      await axiosInstance.post("/signup", {
        email: email,
        fullName: id,
        password: password,
      });
      setIsOpen(true);
      setSuccess("로그인 성공!");
      navigate("/signupsuccess");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      {isOpen && <NotificationModal title={success} onClose={() => setIsOpen(false)}></NotificationModal>}
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
      </div>
    </>
  );
}
