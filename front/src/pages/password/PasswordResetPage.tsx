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

  //
  const [email2, setEmail2] = useState("");
  const [password2, setPassword2] = useState("");

  console.log(email, password);
  console.log(email2, password2);

  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const userEmail = tokenService.getUser().email;

    // 해당 사용자가 아닐 경우 return
    if (userEmail !== email2) {
      setIsOpen(true);
      setEmail("");
      setPassword("");
      return;
    }

    navigate(`/newpassword`);
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
        <div className="flex flex-col ">
          <LoginInput
            label="이메일"
            type="email"
            value={email2}
            handleChange={setEmail2}
            placeholder="이메일"
            error="이메일 형식"
            isValid={isEmailValid}
          />

          <LoginInput
            label="비밀번호"
            type="password"
            value={password2}
            handleChange={setPassword2}
            placeholder="비밀번호"
            error="대/소문자, 특수문자, 숫자 포함 8자리 이상"
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
