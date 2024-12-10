import { useLoginStore } from "../../store/loginStore";

export default function EmailInput() {
  const { email, setEmail, isEmailValid } = useLoginStore();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value.trim();
    setEmail(newEmail); // 상태 업데이트
  };

  return (
    <>
      <div className="flex items-center gap-2 w-full">
        <div className="flex-1">
          <label htmlFor="email" className="text-[10px] mb-[5px]">
            이메일
          </label>
          <input
            id="email"
            type="email"
            value={email}
            placeholder="이메일"
            onChange={handleChange}
            className={`w-full  h-[48px] px-[12px] py-[14px] rounded-[6px] border 
                ${!isEmailValid && "border-red-500"}  `}
          />
          <span className={`text-[12px] h-[16px]  text-red-500 `}>{!isEmailValid && "이메일 형식"}</span>
        </div>
      </div>
    </>
  );
}
