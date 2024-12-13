import { useRef, useState } from "react";
import { useNavigate } from "react-router";
import { useLoginStore } from "../../store/loginStore";
import NoticeModal from "../../components/NoticeModal";
import Button from "../../components/Button";
import Logo from "../../components/Logo";
import { passwordChangeAuth, userLogoutAuth } from "../../apis/auth";
import { tokenService } from "../../utils/token";
import { LoginInput } from "../../components/LoginInput";
import { testPassword } from "../../utils/regex";

export default function NewPasswordPage() {
  const navigate = useNavigate();

  const logout = useLoginStore((state) => state.logout);

  const [openModal, setOpenModal] = useState({
    isOpen: false,
    value: "",
  });

  const [auth, setAuth] = useState({
    password: "",
    passwordConfirm: "",
    isPasswordValid: true,
    isPasswordConfirmValid: true,
  });

  const passwordRef = useRef<HTMLInputElement>(null);
  const passwordConfirmRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const password = passwordRef.current?.value.trim();
    const passwordConfirm = passwordConfirmRef.current?.value.trim();

    // 빈값일 경우 return
    if (!password || !password) {
      setAuth({ ...auth, isPasswordValid: false, isPasswordConfirmValid: false, passwordConfirm: "", password: "" });
      return;
    }

    //  비밀번호 유효성 검사와 비밀번호 값 비교
    if (!testPassword(password) || password !== passwordConfirm) {
      console.log("2");

      setAuth({ ...auth, isPasswordConfirmValid: false, isPasswordValid: false, password: "", passwordConfirm: "" });
      return;
    }

    // 비밀번호 변경 및 로그아웃 API 호출
    try {
      await Promise.all([passwordChangeAuth(password), userLogoutAuth()]);
      logout();
      tokenService.clearAll();
      navigate(`/login`);
    } catch (error) {
      console.error(error);
      // setOpenModal({ ...openModal, isOpen: true, value: "비밀번호 오류" });
    } finally {
      setAuth({ ...auth, isPasswordConfirmValid: false, isPasswordValid: false, passwordConfirm: "", password: "" });
    }
  };

  return (
    <>
      {openModal.isOpen && (
        <NoticeModal onClose={() => setOpenModal({ ...openModal, isOpen: false })} title="알림">
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
            value={auth.password}
            onChange={(e) => setAuth({ ...auth, password: e.target.value })}
            placeholder="새 비밀번호"
            error="대/소문자, 특수문자, 숫자 포함 8자리 이상"
            ref={passwordRef}
            isValid={auth.isPasswordValid}
          />

          <LoginInput
            label="새 비밀번호 확인"
            type="password"
            value={auth.passwordConfirm}
            onChange={(e) => setAuth({ ...auth, passwordConfirm: e.target.value })}
            placeholder="새 비밀번호 확인"
            error="동일한 비밀번호 입력"
            ref={passwordConfirmRef}
            isValid={auth.isPasswordConfirmValid}
          />

          <Button className=" bg-primary text-[#ffffff]  w-full  h-[47px] py-[13px] px-[21px] text-[12px] rounded-[6px] mt-[20px]">
            확인
          </Button>
        </div>
      </form>
    </>
  );
}
