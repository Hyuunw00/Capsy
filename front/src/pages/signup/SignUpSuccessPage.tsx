import { useNavigate } from "react-router";

export default function SignUpSuccessPage() {
  const navigate = useNavigate();
  return (
    <div className="w-[340px] h-[186px] mt-[287px] m-auto">
      <div className="px-[18px]">
        <div className="mb-[26px] text-center">
          <p>회원가입이 완료되었습니다.</p>
          <p>새로운 계정으로 서비스를 이용해보세요.</p>
        </div>
        <div>
          <button
            onClick={() => navigate("/login")}
            className=" bg-primary text-[#ffffff]  w-full  h-[47px] py-[13px] px-[21px] text-[12px] rounded-[6px]"
          >
            로그인하기
          </button>
        </div>
      </div>
    </div>
  );
}
