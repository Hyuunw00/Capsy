import { useState } from "react";
import { Link, useNavigate } from "react-router";

import { useLoginStore } from "../../store/loginStore";
import axiosInstance from "../../apis/axiosInstance";
import NoticeModal from "../../components/NoticeModal";
import { InputWithLabel } from "../../components/InputWithLabel";
import Button from "../../components/Button";
import Logo from "../../components/Logo";
import { loginAuth } from "../../apis/auth";

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

  console.log(email, password);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await loginAuth(email, password);
      const { data, status } = response;
      const { user } = data;

      console.log(user.email, email, status);

      // 해당 사용자가 아닐 경우 return
      if (user.email !== email) {
        console.log("사용자가 아닙니다!");
        return;
      }

      // 로그인 요청이 성공(사용자 인증 성공)
      if (status === 200) {
        navigate(`/newpassword`);
      }
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
        <NoticeModal onClose={() => setIsOpen(false)} title="알림">
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
