import { useState } from "react";
import { Link, useNavigate } from "react-router";

import { useLoginStore } from "../../store/loginStore";
import axiosInstance from "../../apis/axiosInstance";
import NoticeModal from "../../components/NoticeModal";
import { InputWithLabel } from "../../components/InputWithLabel";
import Button from "../../components/Button";
import Logo from "../../components/Logo";

export default function PasswordResetPage() {
  const navigate = useNavigate();
  const {
    email,
    password,
    isEmailValid,
    isPasswordValid,
    setEmail,
    setPassword,
    setIsEmailValid,
    setIsPasswordValid,
    login,
  } = useLoginStore();

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
      navigate(`/newpassword`);
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
        <NoticeModal onClose={() => setIsOpen(false)} title="다시 시도해주세요">
          <p>아이디 또는 비밀번호를</p>
          <p>잘못 입력했습니다.</p>
        </NoticeModal>
      )}
      <form onSubmit={handleSubmit}>
        <Logo>비밀번호 재설정</Logo>
        <div className="flex flex-col gap-[12px]">
          <InputWithLabel
            label="이메일"
            type="email"
            value={email}
            handleChange={setEmail}
            placeholder="이메일"
            error="이메일 형식"
            isValid={isEmailValid}
          />

          <InputWithLabel
            label="비밀번호"
            type="password"
            value={password}
            handleChange={setPassword}
            placeholder="비밀번호"
            error="비밀번호 형식"
            isValid={isPasswordValid}
          />

          <Button className=" bg-primary text-[#ffffff]  w-full  h-[47px] py-[13px] px-[21px] text-[12px] rounded-[6px] mt-[20px]">
            비밀번호 재설정
          </Button>
          <Link to="/signup" className="text-center mt-[16px]  text-[#475569] underline">
            회원가입 바로가기
          </Link>
        </div>
      </form>
    </>
  );
}
