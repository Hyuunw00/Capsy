import { useState } from "react";
import { useNavigate } from "react-router";
import loginLogo from "../../assets/login-logo.svg";
import NoticeModal from "../../components/NoticeModal";
import { signupAuth, userLists } from "../../apis/auth";
import { testEmail, testId, testPassword, testPasswordConfirm } from "../../utils/regex";
import { AuthInput } from "../../components/AuthInput";

export default function SignUpPage() {
  const navigate = useNavigate();

  const [openModal, setOpenModal] = useState({
    isOpen: false,
    value: "",
  });

  const [auth, setAuth] = useState({
    email: "",
    id: "",
    password: "",
    passwordConfirm: "",

    isEmailValid: true,
    isIdValid: true,
    isPasswordValid: true,
    isPasswordConfirmValid: true,
  });

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!auth.isIdValid || !auth.isEmailValid || !auth.isPasswordValid || !auth.isPasswordConfirmValid) {
      setOpenModal({ ...openModal, isOpen: true, value: "입력 값을 확인해주세요!" });
      return;
    }
    try {
      await signupAuth(auth.email, auth.id, auth.password);
      setOpenModal({ ...openModal, isOpen: true, value: "회원가입 성공!" });
      navigate("/signupsuccess");
    } catch (error) {
      console.error(error);
    }
  };

  const handleChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setAuth({ ...auth, email: newEmail, isEmailValid: testEmail(newEmail) });
  };
  const handleCheckEmail = async () => {
    const { data } = await userLists();
    const isExist = data.find((user: UserLists) => user.email === auth.email);
    if (isExist) {
      setOpenModal({ ...openModal, isOpen: true, value: "이미 존재하는 이메일입니다!" });
      setAuth({ ...auth, email: "", isEmailValid: false });
    } else {
      auth.isEmailValid && setOpenModal({ ...openModal, isOpen: true, value: "사용 가능한 이메일입니다!" });
    }
  };

  const handleChangeId = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newId = e.target.value;
    setAuth({ ...auth, id: newId, isIdValid: testId(newId) });
  };
  const handleCheckId = async () => {
    const { data } = await userLists();
    const isExist = data.find((user: UserLists) => user.fullName === auth.id);
    if (isExist) {
      setOpenModal({ ...openModal, isOpen: true, value: "이미 존재하는 아이디입니다!" });
      setAuth({ ...auth, id: "", isIdValid: false });
    } else {
      auth.isIdValid && setOpenModal({ ...openModal, isOpen: true, value: "사용 가능한 아이디입니다!" });
    }
  };

  const handleChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setAuth({ ...auth, password: newPassword, isPasswordValid: testPassword(newPassword) });
  };

  const handleChangePasswordConfirm = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPasswordConfirm = e.target.value;
    setAuth({
      ...auth,
      passwordConfirm: newPasswordConfirm,
      isPasswordConfirmValid: testPasswordConfirm(auth.password, newPasswordConfirm),
    });
  };

  return (
    <>
      {openModal.isOpen && (
        <NoticeModal title="알림" onClose={() => setOpenModal({ ...openModal, isOpen: false })}>
          {openModal.value}
        </NoticeModal>
      )}
      <div>
        <div className="w-[600px] h-[441px] px-[19px]">
          <div className="mt-[160px] mb-[26px]">
            <img src={loginLogo} alt="로고" className="block m-auto" />
          </div>

          <div className="flex flex-col gap-[10px]">
            <AuthInput
              label="이메일"
              type="email"
              value={auth.email}
              placeholder="이메일(이메일 형식)"
              onChange={handleChangeEmail}
              error="이메일 형식"
              isValid={auth.isEmailValid}
            >
              <button
                onClick={handleCheckEmail}
                className="bg-primary text-[#ffffff] text-center w-[68px] h-[48px] py-[13px] px-[21px] text-[14px] rounded-[6px] flex items-center justify-center"
              >
                확인
              </button>
            </AuthInput>

            <AuthInput
              label="아이디"
              type="text"
              value={auth.id}
              placeholder="아이디(영문,숫자 4-12글자)"
              onChange={handleChangeId}
              error="아이디(영문,숫자 4-12글자)"
              isValid={auth.isIdValid}
            >
              <button
                onClick={handleCheckId}
                className="bg-primary text-[#ffffff] text-center w-[68px] h-[48px] py-[13px] px-[21px] text-[14px] rounded-[6px] flex items-center justify-center"
              >
                확인
              </button>
            </AuthInput>

            <AuthInput
              label="비밀번호"
              type="password"
              value={auth.password}
              placeholder="대/소문자, 특수문자, 숫자 포함 8자리 이상"
              onChange={handleChangePassword}
              error="대/소문자, 특수문자, 숫자 포함 8자리 이상"
              isValid={auth.isPasswordValid}
            ></AuthInput>

            <AuthInput
              label="비밀번호 확인"
              type="password"
              value={auth.passwordConfirm}
              placeholder="동일한 비밀번호"
              onChange={handleChangePasswordConfirm}
              error="동일하지 않은 비밀번호"
              isValid={auth.isPasswordConfirmValid}
            ></AuthInput>

            <button
              onClick={handleSubmit}
              className=" bg-primary text-[#ffffff]  w-full  h-[47px] py-[13px] px-[21px] text-[12px] rounded-[6px]"
            >
              회원가입
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
