import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import pictureIcon from "../../assets/pick-picture-icon.svg";
import dateIcon from "../../assets/pick-date-icon.svg";
import EditModal from "./EditModal";
import EditPreview from "./EditPreview";
import EditComplete from "./EditComplete";
import { createPost } from "../../apis/apis";
import { CHANNEL_ID_TIMECAPSULE, CHANNEL_ID_POST } from "../../apis/apis";

export default function EditorPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("general");
  const [showModal, setShowModal] = useState(false);
  const [saveModal, setSaveModal] = useState(false);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
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

  const validateFile = (file: File): { isValid: boolean; error?: string } => {
    const VIDEO_MAX_SIZE = 4 * 1024 * 1024 * 1024; // 4GB
    const IMG_MAX_SIZE = 30 * 1024 * 1024; // 30MB

    if (file.type.startsWith("video/")) {
      if (!["video/mp4", "video/quicktime"].includes(file.type)) {
        return { isValid: false, error: "비디오는 MP4 또는 MOV 형식만 가능합니다." };
      }
      if (file.size > VIDEO_MAX_SIZE) {
        return { isValid: false, error: "비디오 크기는 4GB 이하여야 합니다." };
      }
    } else if (file.type.startsWith("image/")) {
      if (!["image/jpeg", "image/png"].includes(file.type)) {
        return { isValid: false, error: "이미지는 JPG 또는 PNG 형식만 가능합니다." };
      }
      if (file.size > IMG_MAX_SIZE) {
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

    setUploadedImages((prev) => [...prev, ...files]);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDateSubmit = (date: { year: string; month: string; day: string }) => {
    setSelectedDate(date);
    setShowModal(false);
  };

  // 저장 버튼 클릭 시 유효성 검사
  const handleSaveClick = async () => {
    // 텍스트 입력 검증
    if (!text.trim()) {
      alert("텍스트를 입력해주세요.");
      return;
    }

    // 타임캡슐 작성 시 필수 항목 검증
    if (activeTab === "timeCapsule") {
      if (uploadedImages.length === 0) {
        alert("타임캡슐에는 이미지 첨부가 필수입니다.");
        return;
      }
      if (!selectedDate.year || !selectedDate.month || !selectedDate.day) {
        alert("타임캡슐에는 날짜 지정이 필수입니다.");
        return;
      }
    }

    try {
      const channelId = activeTab === "timeCapsule" ? CHANNEL_ID_TIMECAPSULE : CHANNEL_ID_POST;
      
      // 커스텀 데이터 생성
      const customData = {
        title: title || "제목 없음",
        body: text,
        ...(activeTab === "timeCapsule" && {
          closeAt: `${selectedDate.year}-${selectedDate.month.padStart(2, '0')}-${selectedDate.day.padStart(2, '0')}`
        })
      };

      // FormData 생성
      const formData = new FormData();
      formData.append("title", JSON.stringify(customData));
      formData.append("channelId", channelId);

      // 이미지가 있는 경우 추가
      if (uploadedImages.length > 0) {
        uploadedImages.forEach((image) => {
          formData.append("image", image);
        });
      }

      const response = await createPost(formData);
      console.log("게시물 생성 성공:", response);
      setSaveModal(true);

      // 성공 후 상태 페이지로 이동
      if (response?._id) {
        navigate(`/post/${response._id}`);
      }
    } catch (error) {
      console.error("게시물 생성 실패:", error);
      alert("게시물 작성에 실패했습니다.");
    }
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
            multiple
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
          <button onClick={handleSaveClick} className="px-4 py-1 text-sm text-white bg-black rounded">
            저장
          </button>
        </div>
      </nav>
      <main className="flex-1 px-4 py-4 h-2/5">
        <h2 className="text-lg font-semibold h-fit">
          <textarea 
            placeholder="제목 없음" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full text-gray-600 placeholder-gray-300 resize-none h-7 focus:outline-none"
          />
        </h2>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
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
      {saveModal && (
        <EditComplete
          isOpen={saveModal}
          onClose={() => setSaveModal(false)}
          isTimeCapsule={activeTab === "timeCapsule"}
        />
      )}
    </div>
  );
}