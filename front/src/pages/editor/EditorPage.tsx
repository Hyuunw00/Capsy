import { useRef, useState } from "react";
import pictureIcon from "../../assets/pick-picture-icon.svg";
import dateIcon from "../../assets/pick-date-icon.svg";
import EditModal from "./EditModal";
import EditPreview from "./EditPreview";
import NotificationModal from "../../components/NotificationModal";
import NoticeModal from "../../components/NoticeModal";

export default function EditorPage() {
  const [activeTab, setActiveTab] = useState("general");
  const [showModal, setShowModal] = useState(false);
  const [saveModal, setSaveModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 업로드 받은 이미지 상태
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);

  // 타임캡슐 날짜 상태
  const [selectedDate, setSelectedDate] = useState({
    year: "",
    month: "",
    day: "",
  });

  // 프리뷰에서 선택한 사진을 배열에서 제거하는 함수
  const handleDeleteFile = (indexToDelete: number) => {
    setUploadedImages((prev) => prev.filter((_, index) => index !== indexToDelete));
  };

  // 파일 크기와 형식을 검사하는 함수
  const validateFile = (file: File): { isValid: boolean; error?: string } => {
    const videoMaxSize = 4 * 1024 * 1024 * 1024; // 4GB //1 GB (기가바이트) = 1024 MB = 1024 * 1024 * 1024 bytes
    const imageMaxSize = 30 * 1024 * 1024; // 30MB

    // 비디오 파일 검사
    if (file.type.startsWith("video/")) {
      if (!["video/mp4", "video/quicktime"].includes(file.type)) {
        return { isValid: false, error: "비디오는 MP4 또는 MOV 형식만 가능합니다." };
      }
      if (file.size > videoMaxSize) {
        return { isValid: false, error: "비디오 크기는 4GB 이하여야 합니다." };
      }
    }
    // 이미지 파일 검사
    else if (file.type.startsWith("image/")) {
      if (!["image/jpeg", "image/png"].includes(file.type)) {
        return { isValid: false, error: "이미지는 JPG 또는 PNG 형식만 가능합니다." };
      }
      if (file.size > imageMaxSize) {
        return { isValid: false, error: "이미지 크기는 30MB 이하여야 합니다." };
      }
    } else {
      return { isValid: false, error: "지원하지 않는 파일 형식입니다." };
    }

    return { isValid: true };
  };

  const handlePictureClick = () => {
    fileInputRef.current?.click();
  };

  // 파일이 선택되었을 때 실행되는 함수
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    for (const file of files) {
      const validation = validateFile(file);
      if (!validation.isValid) {
        alert(validation.error);
        return;
      }
    }

    // 유효성 통과하면 파일을 상태에 추가하기
    setUploadedImages((prev) => [...prev, ...files]);

    console.log("선택된 파일 목록", files);

    // 파일 선택 초기화 (같은 파일 다시 선택 가능하도록)
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDateSubmit = (date: { year: string; month: string; day: string }) => {
    setSelectedDate(date);
    setShowModal(false);
  };

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
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/jpeg,image/png,video/mp4,video/quicktime"
            onChange={handleFileChange}
            multiple // 다중 파일 선택 가능하도록 설정
          />
          <button onClick={handlePictureClick} className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded">
            <img src={pictureIcon} alt="사진 선택 아이콘" />
          </button>
          {activeTab === "timeCapsule" && (
            <button
              className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded"
              onClick={() => setShowModal(true)}
            >
              <img src={dateIcon} alt="날짜 지정 아이콘" />
            </button>
          )}
        </div>
        <div className="flex items-center gap-4">
          <button className="px-4 py-1 text-sm text-white bg-black rounded">저장</button>
        </div>
      </nav>
      <main className="flex-1 px-4 py-4 h-2/5">
        <textarea
          className="flex-1 w-full mt-2 overflow-scroll text-gray-600 placeholder-gray-300 resize-none h-96 focus:outline-none"
          placeholder={
            activeTab === "general"
              ? "포스트를 작성해주세요."
              : "타임캡슐을 작성해주세요.\n타임캡슐은 이미지 첨부 및 날짜 지정이 필수입니다."
          }
        />
        <EditPreview
          images={uploadedImages}
          showDatePreview={activeTab === "timeCapsule"}
          date={selectedDate}
          onDelete={handleDeleteFile}
        />
      </main>
      {showModal && <EditModal onClose={() => setShowModal(false)} onSubmit={handleDateSubmit} />}
      {saveModal && 
        <NoticeModal title="타임캡슐은 수정할 수 없습니다" onClose={() => setSaveModal(false)}>타임캡슐은 지정한 날짜가 도래하기 전까지
        내용을 수정할 수 없습니다.
        정말 작성을 완료하시겠습니까?</NoticeModal>
      }
    </div>
  );
}
