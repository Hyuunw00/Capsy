import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
import { useLoginStore } from "../../store/loginStore";
import NoticeModal from "../../components/NoticeModal";
import Button from "../../components/Button";
import Logo from "../../components/Logo";
import { LoginInput } from "../../components/LoginInput";
import { testEmail, testPassword } from "../../utils/regex";
import { loginAuth } from "../../apis/auth";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useLoginStore();

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
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  // useEffect(() => {
  //   if (emailRegex.test(email)) setAuth({...auth,})
  //   if (passwordRegex.test(password)) setIsPasswordValid(true);
  // }, [email, password]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const email = emailRef.current?.value.trim();
    const password = passwordRef.current?.value.trim();
    console.log(email, password);

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
    // 고유성 검사
    try {
      const response = await loginAuth(email, password);
      const { token } = response.data;
      login(token); // 로그인 상태 업데이트
      navigate(`/`); // 홈으로 이동
    } catch (error) {
      setOpenModal({ ...openModal, isOpen: true, value: "아이디 또는 비밀번호가 틀립니다!" });
    } finally {
      // 입력값 초기화
      // setPassword("");
      // setEmail("");
      // setIsEmailValid(false);
      // setIsPasswordValid(false);
      setAuth({ ...auth, isEmailValid: false, isPasswordValid: false, email: "", password: "" });
    }
  };

  return (
    <>
      {openModal.isOpen && (
        <NoticeModal onClose={() => setOpenModal({ ...openModal, isOpen: false })} title="알림">
          {openModal.value}
        </NoticeModal>
      )}
      <form onSubmit={handleSubmit} className="px-12">
        <Logo />
        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-1">
            <LoginInput
              label="이메일"
              type="email"
              value={auth.email}
              placeholder="이메일"
              ref={emailRef}
              onChange={(e) => setAuth({ ...auth, email: e.target.value })}
              error="이메일 형식"
              isValid={auth.isEmailValid}
            />

            <LoginInput
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

          <Button className=" bg-primary text-[#ffffff]  w-full  h-[47px] py-[13px] px-[21px] rounded-[6px] mt-[20px]">
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
