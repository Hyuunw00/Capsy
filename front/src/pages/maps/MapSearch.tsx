import img_search from "../../assets/Search.svg";

export default function MapSearch(props: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="px-[20px] py-[10px]">
      <div className="h-[36px] rounded-[10px] bg-gradient-to-r from-[var(--color-secondary)] to-[var(--color-primary)] p-[1px]  ">
        <div className="flex items-center w-full h-full bg-white rounded-[10px] px-4 overflow-hidden ">
          <img src={img_search} alt="검색" className="pr-2" />
          <input
            type="text"
            placeholder="사용자 또는 게시글을 검색하세요"
            {...props}
            className="w-full h-[14px] my-[4px] outline-none"
            //   onFocus={() => setIsFocused(true)}
          />
        </div>
      </div>
    </div>
  );
}
