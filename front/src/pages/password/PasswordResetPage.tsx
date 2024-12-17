import { useRef, useState } from "react";
import NoticeModal from "../../components/NoticeModal";
import Button from "../../components/Button";
import Logo from "../../components/Logo";
import { testEmail, testPassword } from "../../utils/regex";
import { loginAuth } from "../../apis/auth";
import { tokenService } from "../../utils/token";
import NewPasswordPage from "./NewPasswordPage";
import { AuthInput } from "../../components/AuthInput";

export default function PasswordResetPage() {
  const userEmail = tokenService.getUser().email;

  const [openModal, setOpenModal] = useState({
    isOpen: false,
    value: "",
  });

  const [auth, setAuth] = useState({
    email: "",
    password: "",
    isEmailValid: true,
    isPasswordValid: true,
  });

  //  사용자 인증
  const [userAuth, setUserAuth] = useState(false);

  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const email = emailRef.current?.value.trim();
    const password = passwordRef.current?.value.trim();

    // 빈값일 경우 return
    if (!email || !password) {
      setAuth({ ...auth, isEmailValid: false, isPasswordValid: false, email: "", password: "" });
      return;
    }
    // 유효성 검사
    if (!testEmail(email) || !testPassword(password)) {
      setAuth({ ...auth, isEmailValid: false, isPasswordValid: false, email: "", password: "" });

      return;
    }
    // 로그인한 사용자 이메일이 아닐 경우 return
    if (userEmail !== email) {
      setOpenModal({ ...openModal, isOpen: true, value: "로그인한 사용자가 아닙니다" });
      setAuth({ ...auth, isEmailValid: false, isPasswordValid: false, email: "", password: "" });
      return;
    }

    // 고유성 검사
    try {
      const response = await loginAuth(email, password);
      const { status } = response;
      if (status === 200) {
        setUserAuth(true); // 인증성공시 상태값 변환
      }
    } catch (error) {
      setOpenModal({ ...openModal, isOpen: true, value: "아이디 또는 비밀번호가 틀립니다" });
    } finally {
      setAuth({ ...auth, isEmailValid: false, isPasswordValid: false, email: "", password: "" });
    }
  };

  if (userAuth) return <NewPasswordPage />;

  return (
    <>
      {openModal.isOpen && (
        <NoticeModal onClose={() => setOpenModal({ ...openModal, isOpen: false })} title="알림">
          {openModal.value}
        </NoticeModal>
      )}
      <div className="w-full flex flex-col items-center justify-center min-h-[calc(100vh-115px)]">
        <div className="w-full max-w-md px-8 py-8 overflow-y-auto">
          <form onSubmit={handleSubmit} className="flex flex-col gap-[10px]">
            <Logo />
            <div className="flex flex-col gap-2">
              <div className="flex flex-col gap-1">
                <AuthInput
                  label="이메일"
                  type="email"
                  value={auth.email}
                  placeholder="이메일"
                  ref={emailRef}
                  onChange={(e) => setAuth({ ...auth, email: e.target.value })}
                  error="이메일 형식"
                  isValid={auth.isEmailValid}
                />

                <AuthInput
                  label="비밀번호"
                  type="password"
                  value={auth.password}
                  onChange={(e) => setAuth({ ...auth, password: e.target.value })}
                  placeholder="비밀번호"
                  error="대/소문자, 특수문자, 숫자 포함 8자리 이상"
                  isValid={auth.isPasswordValid}
                  ref={passwordRef}
                />
              </div>

              <Button className="bg-primary dark:bg-secondary text-white dark:text-black  w-full  h-[47px] py-[13px] px-[21px] rounded-md mt-[20px]">
                인증
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
