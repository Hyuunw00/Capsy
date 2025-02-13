import { useNavigate } from "react-router";

export default function SignUpSuccessPage() {
  const navigate = useNavigate();
  return (
    <div className="w-full h-full min-h-[calc(100vh-115px)] item-middle">
      <div className="px-[18px]">
        <div className="mb-[26px] text-center text-black dark:text-white">
          <p>회원가입이 완료되었습니다.</p>
          <p>새로운 계정으로 서비스를 이용해보세요.</p>
        </div>
        <div>
          <button
            onClick={() => navigate("/login")}
            className=" bg-primary dark:bg-secondary text-white dark:text-black  w-full  h-[47px] py-[13px] px-[21px] rounded-[6px]"
          >
            로그인하기
          </button>
        </div>
      </div>
    </div>
  );
}
