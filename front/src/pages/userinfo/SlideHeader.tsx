interface SlideHeaderProps {
  title: string;
  count: number;
  showAllText?: string;
  onShowAllClick?: () => void;
}

function SlideHeader({ title, count, showAllText, onShowAllClick }: SlideHeaderProps) {
  return (
    <div className="flex justify-between items-center text-[16px] font-pretendard px-[30px]  mb-[10px]">
      <div className="flex items-center">
        <span className="font-semibold text-black dark:text-white">{title}</span>
        <span className="ml-1 font-semibold text-black dark:text-white">{count}</span>
      </div>
      {onShowAllClick && (
        <span
          className="text-black underline cursor-pointer font-regular font-pretendard dark:text-white"
          onClick={onShowAllClick}
        >
          {showAllText}
        </span>
      )}
    </div>
  );
}

export default SlideHeader;
