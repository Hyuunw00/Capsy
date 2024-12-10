import { useState } from "react";
import pictureIcon from "../../assets/pick-picture-icon.svg";
import dateIcon from "../../assets/pick-date-icon.svg";
import EditModal from "./EditModal";

export default function EditorPage() {
  const [activeTab, setActiveTab] = useState("general");
  const [showModal, setShowModal] = useState(false);  // 모달 상태를 상위 컴포넌트로 이동

  return (
    <div className="relative flex flex-col h-dvh">
      <nav className="border-b">
        <div className="flex items-center">
          <button
            className={`py-3 px-6 border-b-2 w-1/2 transition ${
              activeTab === "general" ? "text-primary border-primary" : "text-gray-400 border-transparent"
            }`}
            onClick={() => setActiveTab("general")}
          >
            일반 포스트
          </button>
          <button
            className={`py-3 px-6 border-b-2 w-1/2 transition ${
              activeTab === "timeCapsule" ? "text-[#4D15FF] border-[#4D15FF]" : "text-gray-400 border-transparent"
            }`}
            onClick={() => setActiveTab("timeCapsule")}
          >
            타임캡슐
          </button>
        </div>
      </nav>
      <nav className="flex items-center justify-between px-4 py-3 border-b border-b-gray-100">
        <div className="flex items-center gap-4">
          <button className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded">
            <img src={pictureIcon} alt="사진 선택 아이콘" />
          </button>
          {activeTab === "timeCapsule" ? (
            <button
              className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded"
              onClick={() => setShowModal(true)}
            >
              <img src={dateIcon} alt="날짜 지정 아이콘" />
            </button>
          ) : null}
        </div>
        <div className="flex items-center gap-4">
          <button className="px-4 py-1 text-sm text-white bg-black rounded">저장</button>
        </div>
      </nav>
      <main className="flex-1 px-4 py-4 h-3/5">
        <textarea
          className="flex-1 w-full h-full mt-2 text-gray-600 placeholder-gray-300 resize-none focus:outline-none"
          placeholder={
            activeTab === "general"
              ? "포스트를 작성해주세요."
              : "타임캡슐을 작성해주세요.\n타임캡슐은 이미지 첨부 및 날짜 지정이 필수입니다."
          }
        />
      </main>
      {showModal && <EditModal onClose={() => setShowModal(false)} />}
    </div>
  );
}