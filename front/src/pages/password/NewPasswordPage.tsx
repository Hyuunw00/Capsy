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
    if (!password || !passwordConfirm) {
      setAuth({ ...auth, isPasswordValid: false, isPasswordConfirmValid: false, passwordConfirm: "", password: "" });
      return;
    }

    // 비밀번호 유효성 검사
    if (!testPassword(password)) {
      setAuth({ ...auth, isPasswordValid: false, password: "", passwordConfirm: "", isPasswordConfirmValid: false });
      setOpenModal({ isOpen: true, value: "형식에 맞게 입력해주세요!" });
      return;
    }

    // 비밀번호 동일 여부 검사
    if (password !== passwordConfirm) {
      setAuth({ ...auth, isPasswordValid: true, isPasswordConfirmValid: false, passwordConfirm: "" });
      setOpenModal({ isOpen: true, value: "동일한 비밀번호를 입력해주세요!" });
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
    }
  };

  return (
    <>
      {openModal.isOpen && (
        <NoticeModal onClose={() => setOpenModal({ ...openModal, isOpen: false })} title="알림">
          {openModal.value}
        </NoticeModal>
      )}

      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-115px)]">
        <div className="w-full max-w-md px-8 py-8 overflow-y-auto">
          <form onSubmit={handleSubmit} className="flex flex-col gap-[10px]">
            <Logo />
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

              <Button className="bg-primary dark:bg-secondary text-white dark:text-black w-full h-[47px] py-[13px] px-[21px] rounded-[6px] mt-[20px]">
                확인
              </Button>
            </div>
          </form>
        </div>
      </div>

      <NotificationModal
        isOpen={successModal}
        title="비밀번호 변경 완료 🎉"
        description="확인 버튼을 누르면 로그인 페이지로 이동합니다!"
      >
        <button
          onClick={() => navigate("/login")}
          className="w-full py-2 text-white dark:text-black bg-primary dark:bg-secondary rounded "
        >
          확인
        </button>
      </NotificationModal>
    </>
  );
}
