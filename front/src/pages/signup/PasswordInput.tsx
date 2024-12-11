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

export default function PasswordInput() {
  const { password, setPassword, isPasswordValid, setIsPasswordValid } = useSignupStore();
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,16}$/;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword); // 상태 업데이트
    setIsPasswordValid(passwordRegex.test(newPassword));
  };

  return (
    <div className="flex flex-col">
      <label htmlFor="password" className="text-[10px] mb-[5px]">
        비밀번호
      </label>
      <div className="flex flex-col  gap-[10px] ">
        <input
          id="password"
          type="password"
          value={password}
          placeholder="비밀번호"
          onChange={handleChange}
          className={`w-full h-[48px] px-[12px] py-[14px] rounded-[6px] 
            border ${isPasswordValid ? "border-gray-300" : "border-red-500"} `}
        />
        <span className="text-[12px] text-red-500">
          {isPasswordValid ? "" : "대/소문자, 특수문자, 숫자 포함 8자리 이상"}
        </span>
      </div>
    </div>
  );
}
