import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";

import { useLoginStore } from "../../store/loginStore";
import NoticeModal from "../../components/NoticeModal";
import Button from "../../components/Button";
import Logo from "../../components/Logo";
import { LoginInput } from "../../components/LoginInput";
import axiosInstance from "../../apis/axiosInstance";
import { tokenService } from "../../utils/token";
import { emailRegex, passwordRegex } from "../../utils/regex";
import { loginAuth } from "../../apis/auth";

export default function LoginPage() {
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

  useEffect(() => {
    if (emailRegex.test(email)) setIsEmailValid(true);
    if (passwordRegex.test(password)) setIsPasswordValid(true);
  }, [email, password]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      // loginAuth 호출하여 로그인 처리
      const response = await loginAuth(email, password);
      const { token } = response.data;

      login(token); // 로그인 상태 업데이트
      navigate(`/`); // 홈으로 이동
    } catch (error) {
      setIsOpen(true); // 로그인 실패 시 모달 표시
    } finally {
      // 입력값 초기화
      setPassword("");
      setEmail("");
      setIsEmailValid(false);
      setIsPasswordValid(false);
    }
  };

  return (
    <>
      {isOpen && (
        <NoticeModal onClose={() => setIsOpen(false)} title="알림">
          아이디 또는 비밀번호를
          <br />
          잘못 입력했습니다.
        </NoticeModal>
      )}
      <form onSubmit={handleSubmit}>
        <Logo>로그인</Logo>
        <div className="flex flex-col ">
          <LoginInput
            label="이메일"
            type="email"
            value={email}
            handleChange={setEmail}
            placeholder="이메일"
            error="이메일 형식"
            isValid={isEmailValid}
          />

          <LoginInput
            label="비밀번호"
            type="password"
            value={password}
            handleChange={setPassword}
            placeholder="비밀번호"
            error="대/소문자, 특수문자, 숫자 포함 8자리 이상"
            isValid={isPasswordValid}
          />

          <Button className=" bg-primary text-[#ffffff]  w-full  h-[47px] py-[13px] px-[21px] text-[12px] rounded-[6px] mt-[20px]">
            로그인
          </Button>
          <Link to="/signup" className="text-center mt-[16px]  text-[#475569] underline">
            회원가입 바로가기
          </Link>
        </div>
      </form>
    </>
  );
}
