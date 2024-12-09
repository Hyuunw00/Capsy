import { useSignupStore } from "../../store/signupStore";

export default function IdInput() {
  const { id, setId, isIdValid, setIsIdValid } = useSignupStore();
  const idRegex = /^[A-Za-z0-9]{4,12}$/;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newId = e.target.value;
    setId(newId); // 상태 업데이트
    setIsIdValid(idRegex.test(newId));
  };

  return (
    <div className="flex flex-col w-full">
      <label htmlFor="id" className="text-[10px] mb-[5px]">
        아이디
      </label>
      <div className="flex flex-col  gap-[10px] ">
        <input
          id="id"
          type="text"
          value={id}
          placeholder="아이디"
          onChange={handleChange}
          className=" w-full  h-[48px] px-[12px] py-[14px] rounded-[6px] border"
        />
        <span className="text-[12px] text-red-500">{isIdValid ? "" : "4-12자 사이의 영문 및 숫자"}</span>
      </div>
    </div>
  );
}
