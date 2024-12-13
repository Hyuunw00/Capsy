import mainLogo from "../assets/login-logo.svg";
export default function Logo() {
  return (
    <div className="mt-[160px] mb-[26px] text-center">
      <img src={mainLogo} alt="로고" className="block m-auto w-[187px]" />
      <div className="mt-[26px] block text-[18px] text-[#475569]"></div>
    </div>
  );
}
