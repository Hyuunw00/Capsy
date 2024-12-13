import { forwardRef } from "react";
interface InputWithLabelProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  isValid: boolean;
  children?: React.ReactNode;
}
export const LoginInput = forwardRef<HTMLInputElement, InputWithLabelProps>((props, ref) => {
  const { label, error, isValid, children, ...args } = props;

  return (
    <>
      <div>
        <label htmlFor="email" className="text-sm mb-[5px] block">
          {label}
        </label>

        <div className="flex items-center gap-4">
          <input
            {...args}
            ref={ref}
            autoComplete="current-password"
            className={`flex-1 h-[48px] px-[12px] py-[14px] rounded-[6px] border text-[16px] 
          ${!isValid ? "border-red-500" : ""}`}
          />
          {children}
        </div>

        {error && <p className="text-[12px] h-[16px] text-red-500">{!isValid && error}</p>}
      </div>
    </>
  );
});
