interface InputWithLabelProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  placeholder: string;
  value: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isError?: boolean | string;
  disable?: boolean;
}

export function InputWithLabel({
  label,
  placeholder,
  value,
  onChange,
  isError,
  disable,
  ...props
}: InputWithLabelProps) {
  return (
    <div>
      <label className="text-gray-600 ">{label}</label>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        disabled={disable}
        onChange={onChange}
        className={`${disable && "bg-[#f0f0f0]"} w-full p-2 border rounded placeholder:text-gray-300 ${
          isError ? "border-red-500" : "border-gray-300 "
        }`}
        {...props}
      />
    </div>
  );
}
