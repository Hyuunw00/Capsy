import { useSignupStore } from "../../store/signupStore";

export default function EmailInput() {
  const { email, setEmail, isEmailValid, setIsEmailValid } = useSignupStore();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  console.log(isEmailValid, email);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setEmail(newEmail); // 상태 업데이트
    setIsEmailValid(emailRegex.test(newEmail));
  };

  return (
    <div className="flex flex-col w-full">
      <label htmlFor="email" className="text-[10px] mb-[5px]">
        이메일
      </label>
      <div className="flex flex-col  gap-[10px] ">
        <input
          id="email"
          type="email"
          value={email}
          placeholder="이메일"
          onChange={handleChange}
          className=" w-full  h-[48px] px-[12px] py-[14px] rounded-[6px] border"
        />
        <span className="text-[12px] text-red-500">{isEmailValid ? "" : "이메일 형식"}</span>
      </div>
    </div>
  );
}
