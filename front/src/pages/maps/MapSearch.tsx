import img_search from "../../assets/Search.svg";
import img_close from "../../assets/purple-close.svg";

export default function MapSearch({
  value,
  handleChange,
  handleKeyDown,
}: {
  value: string;
  handleChange: (value: string) => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}) {
  return (
    <>
      <form>
        <div className="px-[20px] py-[10px]">
          <div className="h-[36px] rounded-[10px] bg-gradient-to-r from-[var(--color-secondary)] to-[var(--color-primary)] p-[1px]  ">
            <div className="flex items-center w-full h-full bg-white rounded-[10px] px-4 overflow-hidden ">
              <img src={img_search} alt="검색" className="pr-2" />
              <input
                type="text"
                placeholder="장소를 검색해주세요."
                value={value}
                onChange={(e) => handleChange(e.target.value)}
                className="w-full h-[14px] my-[4px] outline-none"
                onKeyDown={(e) => handleKeyDown(e)}
              />
              <button type="button" className="bg-bg-400 w-7 h-6 rounded-[50px] mr-2" onClick={() => handleChange("")}>
                <img className="w-full h-full" src={img_close} alt="취소" />
              </button>
            </div>
          </div>
        </div>
      </form>
    </>
  );
}
