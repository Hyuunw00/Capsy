import { useLoginStore } from "../../store/loginStore";

export default function PasswordInput() {
  const { password, setPassword, isPasswordValid } = useLoginStore();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword); // 상태 업데이트
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
          className={`w-full h-[48px] px-[12px] py-[14px] rounded-[6px] border
            ${!isPasswordValid && "border-red-500"} 
            `}
        />
      </div>
      <span className="text-[12px] text-red-500">
        {!isPasswordValid && "대/소문자, 특수문자, 숫자 포함 8자리 이상"}
      </span>
    </div>
  );
}
