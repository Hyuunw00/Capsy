import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useLoginStore } from "../../store/loginStore";
import NoticeModal from "../../components/NoticeModal";
import { InputWithLabel } from "../../components/InputWithLabel";
import Button from "../../components/Button";
import Logo from "../../components/Logo";
import { passwordChangeAuth } from "../../apis/auth";
import { tokenService } from "../../utils/token";
import { LoginInput } from "../../components/LoginInput";

export default function NewPasswordPage() {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,16}$/;

  const navigate = useNavigate();
  const {
    password,
    isPasswordValid,
    passwordConfirm,
    isPasswordConfirmValid,
    setPassword,
    setPasswordConfirm,
    setIsPasswordValid,
    setIsPasswordConfirmValid,
  } = useLoginStore();
  const logout = useLoginStore((state) => state.logout);

  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!passwordRegex.test(password) || password !== passwordConfirm) {
      setIsPasswordValid(false);
      setIsPasswordConfirmValid(false);
      setIsOpen(true);
      return;
    }
    await passwordChangeAuth(password);
    logout();
    tokenService.clearAll();
    setPassword("");
    setPasswordConfirm("");
    navigate(`/login`);
  };

  return (
    <>
      {isOpen && (
        <NoticeModal onClose={() => setIsOpen(false)} title="알림">
          <p>비밀번호가 다릅니다.</p>
          <p>다시 입력해주세요.</p>
        </NoticeModal>
      )}
      <form onSubmit={handleSubmit}>
        <Logo>
          <p>본인 인증이 완료되었습니다.</p>
          <p>새로운 비밀번호를 설정해주세요.</p>
        </Logo>
        <div className="flex flex-col gap-[12px]">
          <LoginInput
            label="새 비밀번호"
            type="password"
            value={password}
            handleChange={setPassword}
            placeholder="새 비밀번호"
            error="대/소문자, 특수문자, 숫자 포함 8자리 이상"
            isValid={isPasswordValid}
          />

          <LoginInput
            label="새 비밀번호 확인"
            type="password"
            value={passwordConfirm}
            handleChange={setPasswordConfirm}
            placeholder="새 비밀번호 확인"
            error="대/소문자, 특수문자, 숫자 포함 8자리 이상"
            isValid={isPasswordConfirmValid}
          />

          <Button className=" bg-primary text-[#ffffff]  w-full  h-[47px] py-[13px] px-[21px] text-[12px] rounded-[6px] mt-[20px]">
            확인
          </Button>
          <Link to="/signup" className="text-center mt-[16px]  text-[#475569] underline">
            회원가입 바로가기
          </Link>
        </div>
      </form>
    </>
  );
}
