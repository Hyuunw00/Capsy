import { useEffect } from "react";
import { useLoginStore } from "../store/loginStore";

interface InputWithLabelProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  value?: string;
  handleChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  type: string;
  isValid: boolean;
}
export const LoginInput = ({ label, placeholder, value, handleChange, error, type, isValid }: InputWithLabelProps) => {
  const { setEmail, setPassword, setPasswordConfirm, setIsEmailValid, setIsPasswordValid, setIsPasswordConfirmValid } =
    useLoginStore();

  useEffect(() => {
    setEmail("");
    setPassword("");
    setPasswordConfirm("");

    setIsEmailValid(false);
    setIsPasswordValid(false);
    setIsPasswordConfirmValid(false);
  }, []);

  return (
    <>
      <div className="flex-1 ">
        <div>
          <label htmlFor="email" className="text-sm mb-[5px]">
            {label}
            <input
              type={type}
              value={value}
              placeholder={placeholder}
              onChange={(e) => handleChange(e.target.value)}
              className={`w-full  h-[48px] px-[12px] py-[14px] rounded-[6px] border text-[16px]
                ${!isValid && "border-red-500"}  `}
            />
          </label>
          {error && <p className={`text-[12px] h-[16px]  text-red-500 `}>{!isValid && error}</p>}
        </div>
      </div>
    </>
  );
};