import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

import { useLoginStore } from "../../store/loginStore";
import NoticeModal from "../../components/NoticeModal";
import Button from "../../components/Button";
import Logo from "../../components/Logo";
import { loginAuth } from "../../apis/auth";
import { LoginInput } from "../../components/LoginInput";
import { tokenService } from "../../utils/token";
import { emailRegex, passwordRegex } from "../../utils/regex";

export default function PasswordResetPage() {
  const navigate = useNavigate();
  const { email, password, isEmailValid, isPasswordValid, setEmail, setPassword, setIsEmailValid, setIsPasswordValid } =
    useLoginStore();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (emailRegex.test(email)) setIsEmailValid(true);
    if (passwordRegex.test(password)) setIsPasswordValid(true);
  }, [email, password]);

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
    try {
      const response = await loginAuth(email, password);
      const { status } = response;
      // 로그인 인증 통과시
      if (status === 200) {
        navigate(`/newpassword`);
      }
    } catch (error) {
      setIsOpen(true);
    } finally {
      setEmail("");
      setPassword("");
      setIsEmailValid(false);
      setIsPasswordValid(false);
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
      <form onSubmit={handleSubmit} className="px-12">
        <Logo />
        <p>비밀번호 변경을 위한 사용자 인증을</p>
        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-1">
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
          </div>

          <Button className=" bg-primary text-[#ffffff]  w-full  h-[47px] py-[13px] px-[21px] rounded-[6px] mt-[20px]">
            인증
          </Button>
        </div>
      </form>
    </>
  );
}
