import mainLogo from "../assets/login-logo.svg";
import darkLogo from "../assets/login-logo-white.svg";
import { useThemeStore } from "../store/themeStore";
export default function Logo() {
  const { isDark } = useThemeStore();

  return (
    <div className="mt-[160px] mb-[26px] text-center">
      <img src={isDark ? darkLogo : mainLogo} alt="로고" className="block m-auto w-[187px]" />
      <div className="mt-[26px] block text-[18px] text-[#475569]"></div>
    </div>
  );
}
