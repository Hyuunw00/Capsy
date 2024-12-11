import { useState } from "react";
import { Link, useNavigate } from "react-router";

import { useLoginStore } from "../../store/loginStore";
import NoticeModal from "../../components/NoticeModal";
import Button from "../../components/Button";
import Logo from "../../components/Logo";
import { loginAuth } from "../../apis/auth";
import { LoginInput } from "../../components/LoginInput";
import { tokenService } from "../../utils/token";

export default function PasswordResetPage() {
  const navigate = useNavigate();
  const { email, password, isEmailValid, isPasswordValid, setEmail, setPassword, setIsEmailValid, setIsPasswordValid } =
    useLoginStore();
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const userEmail = tokenService.getUser().email;

    // 1. 해당 사용자 이메일이 아닐 경우 return
    if (userEmail !== email) {
      setIsOpen(true);
      setEmail("");
      setPassword("");
      return;
    }
    // 2. 해당 사용자의 이메일, 비밀번호가 회원가입 돼있어야함
    const response = await loginAuth(email, password);
    const { status } = response;

    // 로그인 인증 통과시
    if (status === 200) {
      setEmail("");
      setPassword("");
      navigate(`/newpassword`);
    }
  };

  return (
    <>
      {isOpen && (
        <NoticeModal onClose={() => setIsOpen(false)} title="알림">
          아이디 또는 비밀번호를 <br />
          잘못 입력했습니다.
        </NoticeModal>
      )}
      <form onSubmit={handleSubmit}>
        <Logo>사용자 인증</Logo>
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
            인증
          </Button>
          <Link to="/signup" className="text-center mt-[16px]  text-[#475569] underline">
            회원가입 바로가기
          </Link>
        </div>
      </form>
    </>
  );
}
