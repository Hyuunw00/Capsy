import loginLogo from "../../assets/login-logo.svg";
import { Link, useNavigate } from "react-router";
import { useLoginStore } from "../../store/loginStore";
import axiosInstance from "../../apis/axiosInstance";
import LoginPasswordInput from "./PasswordInput";
import LoginEmailInput from "./EmailInput";
import { useState } from "react";
import NoticeModal from "../../components/NoticeModal";

export default function Login() {
  const navigate = useNavigate();
  const { email, password, setEmail, setPassword, setIsEmailValid, setIsPasswordValid, login } = useLoginStore();
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const { data } = await axiosInstance.post("/login", {
        email: email,
        password: password,
      });
      login(data.token);
      setIsEmailValid(true);
      setIsPasswordValid(true);
      navigate("/");
    } catch (error) {
      console.error(error);
      setIsOpen(true);
      setIsEmailValid(false);
      setIsPasswordValid(false);
      setPassword("");
      setEmail("");
    }
  };

  return (
    <>
      {isOpen && (
        <NoticeModal onClose={() => setIsOpen(false)} title="로그인을 다시 시도해주세요">
          <p>아이디 또는 비밀번호를</p>
          <p>잘못 입력했습니다.</p>
        </NoticeModal>
      )}
      <form onSubmit={handleSubmit}>
        <div className="mt-[160px] mb-[26px]">
          <img src={loginLogo} alt="로고" className="block m-auto w-[187px]" />
        </div>
        <div className="flex flex-col gap-[10px]">
          <LoginEmailInput />
          <LoginPasswordInput />
          <button className=" bg-primary text-[#ffffff]  w-full  h-[47px] py-[13px] px-[21px] text-[12px] rounded-[6px] mt-[20px]">
            로그인
          </button>
          <Link to="/signup" className="text-center mt-[16px]  text-[#475569] underline">
            회원가입 바로가기
          </Link>
        </div>
      </form>
    </>
  );
}
