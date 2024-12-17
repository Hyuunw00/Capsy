import { useEffect, useState } from "react";

import img_search from "../../assets/Search.svg";
import MapPage from "./MapPage";

export default function LandingPage() {
  // LandingPage 컴포넌트에 입력 폼을 구현하고, 입력 값을 Map 컴포넌트로 넘긴다.

  const [value, setValue] = useState("");
  const [keyword, setKeyword] = useState("");

  function handleSubmitKeyword(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (value === "") {
      alert("검색어를 입력해주세요.");
      return;
    }
    setKeyword(value);
  }

  return (
    <div className="w-full h-screen">
      <form onSubmit={handleSubmitKeyword}>
        <div className="px-[20px] py-[10px]">
          <div className="h-[36px] rounded-[10px] bg-gradient-to-r from-[var(--color-secondary)] to-[var(--color-primary)] p-[1px]  ">
            <div className="flex items-center w-full h-full bg-white rounded-[10px] px-4 overflow-hidden ">
              <img src={img_search} alt="검색" className="pr-2" />
              <input
                type="text"
                placeholder="사용자 또는 게시글을 검색하세요"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="w-full h-[14px] my-[4px] outline-none"
              />
            </div>
          </div>
        </div>
      </form>
      {/* 입력한 검색어 넘기기 */}
      <MapPage keyword={keyword} />
    </div>
  );
}
