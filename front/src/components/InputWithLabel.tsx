type InputWithLabelProps = {
  label: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  error?: string;
};

export const InputWithLabel = ({ 
  label,
  value,
  onChange,
  placeholder,
  error
}: InputWithLabelProps) => {
  return (
    <div className="w-full mb-4">
      <label className="block mb-1 ml-1 text-sm text-gray-700">
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full h-10 px-4 rounded border text-sm placeholder:text-[#acacac]"
      />
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};