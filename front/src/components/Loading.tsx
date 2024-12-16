import loadingImg from '../assets/loading-icon-black.svg';
import loadingImgWhite from '../assets/loading-icon.svg';
import { useThemeStore } from '../store/themeStore'

const Loading = () => {
  const { isDark } = useThemeStore();
  return (
    <div className='absolute top-0 left-0 z-30 w-full bg-white abs h-dvh item-middle dark:bg-black'>
      <img src={isDark ? loadingImgWhite : loadingImg} alt="로딩 이미지" />
    </div>
  );
}

export default Loading;