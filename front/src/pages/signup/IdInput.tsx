import { useState } from "react";
import axiosInstance from "../../apis/axiosInstance";
import { useSignupStore } from "../../store/signupStore";
import NotificationModal from "../../components/NotificationModal";

export default function IdInput() {
  const { id, setId, isIdValid, setIsIdValid } = useSignupStore();
  const idRegex = /^[A-Za-z0-9]{4,12}$/;

  const [isOpen, setIsOpen] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newId = e.target.value;
    setId(newId); // 상태 업데이트
  };

  const handleCheckId = async () => {
    try {
      const { data } = await axiosInstance.get("/users/get-users");
      const isExist = data.find((user: UserLists) => user.fullName === id);
      if (isExist) {
        setIsOpen(true);
        setIsIdValid(false);
        return;
      }
      setIsIdValid(idRegex.test(id));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      {isOpen && (
        <NotificationModal title="이미 존재하는 아이디입니다!" onClose={() => setIsOpen(false)}></NotificationModal>
      )}
      <div className="flex items-center gap-2 w-full">
        <div className="flex-1 ">
          <label htmlFor="id" className="text-[10px] mb-[5px]">
            아이디
          </label>
          <input
            id="id"
            type="text"
            value={id}
            placeholder="아이디"
            onChange={handleChange}
            className={`w-full  h-[48px] px-[12px] py-[14px] rounded-[6px] border  ${!isIdValid && "border-red-500 "}`}
          />
          <span className={`text-[12px] h-[16px]  ${isIdValid ? "text-gray-500 " : "text-red-500 "}`}>
            {isIdValid ? "유효한 아이디입니다!" : "4-12자"}
          </span>
        </div>
        <div className="flex items-center">
          <button
            onClick={handleCheckId}
            className="bg-primary text-[#ffffff] text-center w-[68px] h-[48px] py-[13px] px-[21px] text-[14px] rounded-[6px] flex items-center justify-center"
          >
            확인
          </button>
        </div>
      </div>
    </>
  );
}
