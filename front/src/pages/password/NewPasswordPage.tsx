import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useLoginStore } from "../../store/loginStore";
import NoticeModal from "../../components/NoticeModal";
import Button from "../../components/Button";
import Logo from "../../components/Logo";
import { passwordChangeAuth } from "../../apis/auth";
import { tokenService } from "../../utils/token";
import { LoginInput } from "../../components/LoginInput";
import { passwordRegex } from "../../utils/regex";

export default function NewPasswordPage() {
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

  useEffect(() => {
    if (passwordRegex.test(password)) setIsPasswordValid(true);
    if (password.length > 0 && passwordConfirm === password) setIsPasswordConfirmValid(true);
    return () => {
      setIsPasswordValid(false);
      setIsPasswordConfirmValid(false);
    };
  }, [password, passwordConfirm]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 1. 비밀번호 유효성 검사와 비밀번호 값 비교
    if (!passwordRegex.test(password) || password !== passwordConfirm) {
      setIsOpen(true);
      setPassword("");
      setPasswordConfirm("");
      return;
    }

    // 2. 비밀번호 변경 API 호출
    try {
      await passwordChangeAuth(password);
      logout();
      tokenService.clearAll();
      navigate(`/login`);
    } catch (error) {
      console.error(error);
      setIsOpen(true);
    } finally {
      setPassword("");
      setPasswordConfirm("");
    }
  };

  return (
    <>
      {isOpen && (
        <NoticeModal onClose={() => setIsOpen(false)} title="알림">
          비밀번호가 다릅니다. <br />
          다시 입력해주세요.
        </NoticeModal>
      )}
      <form onSubmit={handleSubmit} className="px-12">
        <Logo />
        {/* <p>본인 인증이 완료되었습니다.</p>
          <p>새로운 비밀번호를 설정해주세요.</p> */}
        <div className="flex flex-col gap-2">
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
            error="동일한 비밀번호 입력"
            isValid={isPasswordConfirmValid}
          />

          <Button className=" bg-primary text-[#ffffff]  w-full  h-[47px] py-[13px] px-[21px] text-[12px] rounded-[6px] mt-[20px]">
            확인
          </Button>
        </div>
      </form>
    </>
  );
}
