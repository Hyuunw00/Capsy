import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";

import { useLoginStore } from "../../store/loginStore";
import NoticeModal from "../../components/NoticeModal";
import { InputWithLabel } from "../../components/InputWithLabel";
import Button from "../../components/Button";
import Logo from "../../components/Logo";
import { loginAuth } from "../../apis/auth";
import { LoginInput } from "../../components/LoginInput";
import axiosInstance from "../../apis/axiosInstance";
import { tokenService } from "../../utils/token";

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

  // useEffect(() => {
  //   setEmail("");
  //   setPassword("");
  // }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post("/login", { email, password });
      const { token, user } = response.data;
      tokenService.setToken(token);
      tokenService.setUser(user);
      login(token);
      navigate(`/`);
    } catch (error) {
      setIsOpen(true);
      setPassword("");
      setEmail("");
      setIsEmailValid(false);
      setIsPasswordValid(false);
      throw error;
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
            error="비밀번호 형식"
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
