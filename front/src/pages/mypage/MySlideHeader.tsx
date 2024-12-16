interface MySlideHeaderProps {
  title: string;
  count: number;
  showAllText?: string;
  onShowAllClick?: () => void;
}

function MySlideHeader({ title, count, showAllText, onShowAllClick }: MySlideHeaderProps) {
  return (
    <div className="flex justify-between items-center text-[16px] font-pretendard px-[30px]  mb-[10px]">
      <div className="flex items-center">
        <span className="font-semibold">{title}</span>
        <span className="ml-1 font-semibold">{count}</span>
      </div>
      {onShowAllClick && (
        <span className="font-regular font-pretendard underline cursor-pointer" onClick={onShowAllClick}>
          {showAllText}
        </span>
      )}
    </div>
  );
}

export default MySlideHeader;
