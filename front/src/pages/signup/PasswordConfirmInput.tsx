import { useSignupStore } from "../../store/signupStore";

// interface AuthInputProps {
//   name: string;
//   id: string;
//   type: string;
//   isValid: boolean;
//   value: string;
//   setValue: (value: string) => void;
//   setIsValid: (isValid: boolean) => void;
//   placeholder: string;
// }
// 비밀번호 유효성검사

export default function PasswordConfirmInput() {
  const { password, passwordConfirm, setPasswordConfirm, isPasswordConfirmValid, setIsPasswordConfirmValid } =
    useSignupStore();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPasswordConfirm(newPassword);

    if (password === newPassword) setIsPasswordConfirmValid(true);
    else setIsPasswordConfirmValid(false);
  };

  return (
    <div className="flex flex-col">
      <label htmlFor="passwordConfirm" className="text-[10px] mb-[5px]">
        비밀번호 확인
      </label>
      <div className="flex flex-col  gap-[10px] ">
        <input
          id="passwordConfirm"
          type="password"
          value={passwordConfirm}
          placeholder="비밀번호 확인"
          onChange={handleChange}
          className={`w-full  h-[48px] px-[12px] py-[14px] rounded-[6px] border ${isPasswordConfirmValid ? "border-gray-300" : "border-red-500"}`}
        />
        <span className="text-[12px] text-gray-500">{isPasswordConfirmValid ? "비밀번호 동일!" : ""}</span>
      </div>
    </div>
  );
}
