import { useState, forwardRef } from "react";
import eyesOpen from "../assets/passwordIcon/eyes-open.svg";
import eyesClose from "../assets/passwordIcon/eyes-close.svg";

interface InputWithLabelProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  isValid: boolean;
  children?: React.ReactNode;
}

export const AuthInput = forwardRef<HTMLInputElement, InputWithLabelProps>((props, ref) => {
  const { label, error, isValid, children, type, ...args } = props;
  const [showPassword, setShowPassword] = useState(false);

  // 비밀번호 보기 버튼
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const isPassword = type === "password";

  return (
    <>
      <div>
        <label htmlFor="email" className="text-sm mb-[5px] block text-black dark:text-gray-100">
          {label}
        </label>
        <div className="relative flex items-center gap-4">
          <input
            {...args}
            ref={ref}
            type={isPassword ? (showPassword ? "text" : "password") : type}
            autoComplete="current-password"
            className={`flex-1 h-[48px] px-[12px] py-[14px] rounded-[6px] border text-[16px]
              ${!isValid ? "border-red-500" : ""}`}
          />
          {isPassword && (
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute text-gray-500 -translate-y-1/2 right-3 top-1/2 hover:text-gray-700 focus:outline-none"
            >
              {showPassword ? (
                <img src={eyesOpen} alt="비밀번호 보지 않음" className="w-5 h-5" />
              ) : (
                <img src={eyesClose} alt="비밀번호 보기" className="w-5 h-5" />
              )}
            </button>
          )}
          {children}
        </div>
        {error && <p className="text-[12px] h-[16px] text-red-500">{!isValid && error}</p>}
      </div>
    </>
  );
});

export default AuthInput;
