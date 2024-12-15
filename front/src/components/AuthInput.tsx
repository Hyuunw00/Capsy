import { forwardRef, useState } from "react";
import eyesOpen from '../assets/passwordIcon/eyes-open.svg';
import eyesClose from '../assets/passwordIcon/eyes-close.svg';

interface InputWithLabelProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  isValid: boolean;
  children?: React.ReactNode;
}

export const AuthInput = forwardRef<HTMLInputElement, InputWithLabelProps>((props, ref) => {
  const { label, error, isValid, children, type, ...args } = props;
  const [showPassword, setShowPassword] = useState(false);
  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <div>
        <label htmlFor="email" className="text-sm mb-[5px] block">
          {label}
        </label>
        <div className="relative">
          <input
            {...args}
            ref={ref}
            type={type === "password" ? (showPassword ? "text" : "password") : type}
            autoComplete="current-password"
            className={`w-full h-[48px] px-[12px] py-[14px] rounded-[6px] border text-[16px]
              ${!isValid ? "border-red-500" : ""}`}
          />
          {type === "password" && (
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute -translate-y-1/2 right-3 top-1/2"
            >
              <img 
                src={showPassword ? eyesOpen : eyesClose} 
                alt={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
                className="w-6 h-6 transition"
              />
            </button>
          )}
        </div>
        {error && <p className="text-[12px] h-[16px] text-red-500">{!isValid && error}</p>}
      </div>
    </>
  );
});