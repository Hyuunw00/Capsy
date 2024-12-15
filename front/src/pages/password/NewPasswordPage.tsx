import { useRef, useState } from "react";
import { useNavigate } from "react-router";
import { useLoginStore } from "../../store/loginStore";
import NoticeModal from "../../components/NoticeModal";
import Button from "../../components/Button";
import Logo from "../../components/Logo";
import { passwordChangeAuth, userLogoutAuth } from "../../apis/auth";
import { tokenService } from "../../utils/token";
import { testPassword } from "../../utils/regex";
import { AuthInput } from "../../components/AuthInput";
import NotificationModal from "../../components/NotificationModal";

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
  const [successModal, setSuccessModal] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const password = passwordRef.current?.value.trim();
    const passwordConfirm = passwordConfirmRef.current?.value.trim();

    // 빈값일 경우 return
    if (!password || !password) {
      setAuth({ ...auth, isPasswordValid: false, isPasswordConfirmValid: false, passwordConfirm: "", password: "" });
      return;
    }

    // 비밀번호 형식 검사
    if (!testPassword(password)) {
      setAuth({ ...auth, isPasswordValid: false, password: "" });
      return;
    }

    // 비밀번호 동일 여부 검사
    if (password !== passwordConfirm) {
      setAuth({ ...auth, isPasswordConfirmValid: false, passwordConfirm: "" });
      setOpenModal({ isOpen: true, value: "새 비밀번호와 동일한 비밀번호를 입력해주세요." });
      return;
    }

    // 비밀번호 변경 및 로그아웃 API 호출
    try {
      await Promise.all([passwordChangeAuth(password), userLogoutAuth()]);
      logout();
      tokenService.clearAll();
      setSuccessModal(true);
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
        <NoticeModal onClose={() => setOpenModal({ ...openModal, isOpen: false })} title="동일한 비밀번호">
          {openModal.value}
        </NoticeModal>
      )}
      <form onSubmit={handleSubmit} className="px-12">
        <Logo />
        {/* <p>본인 인증이 완료되었습니다.</p>
          <p>새로운 비밀번호를 설정해주세요.</p> */}
        <div className="flex flex-col gap-2">
          <AuthInput
            label="새 비밀번호"
            type="password"
            value={auth.password}
            onChange={(e) => setAuth({ ...auth, password: e.target.value })}
            placeholder="새 비밀번호"
            error="대/소문자, 특수문자, 숫자 포함 8자리 이상"
            ref={passwordRef}
            isValid={auth.isPasswordValid}
          />

          <AuthInput
            label="새 비밀번호 확인"
            type="password"
            value={auth.passwordConfirm}
            onChange={(e) => setAuth({ ...auth, passwordConfirm: e.target.value })}
            placeholder="새 비밀번호 확인"
            error="동일하지 않은 비밀번호입니다"
            ref={passwordConfirmRef}
            isValid={auth.isPasswordConfirmValid}
          />

          <Button className=" bg-primary text-[#ffffff]  w-full  h-[47px] py-[13px] px-[21px] rounded-md mt-[20px]">
            확인
          </Button>
        </div>
      </form>
      <NotificationModal
        isOpen={successModal}
        title="비밀번호 변경 완료 🎉"
        description="확인 버튼을 누르면 로그인 페이지로 이동합니다!"
      >
        <button onClick={() => navigate("/login")} className="w-full py-2 text-white bg-black rounded-md">
          확인
        </button>
      </NotificationModal>
    </>
  );
}
