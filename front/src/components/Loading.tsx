import loadingImg from '../assets/loading-icon-black.svg';

const Loading = () => {
  return (
    <div className='absolute top-0 left-0 z-30 w-full bg-white abs h-dvh item-middle'>
      <img src={loadingImg} alt="로딩 이미지" />
    </div>
  );
}

export default Loading;