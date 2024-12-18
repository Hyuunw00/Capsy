import { useRef, useState } from "react";
import pictureIcon from "../../assets/pick-picture-icon.svg";
import dateIcon from "../../assets/pick-date-icon.svg";
import EditPreview from "./EditPreview";
import EditComplete from "./EditComplete";
import { createPost } from "../../apis/apis";
import { CHANNEL_ID_EVENT } from "../../apis/apis";
import EventEditModal from "./EventEditModal";

export default function EventEditorPage() {
  const activeTab = "event";
  const [showModal, setShowModal] = useState(false);
  const [saveModal, setSaveModal] = useState(false);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [createdPostId, setCreatedPostId] = useState<string | null>(null);

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
    const IMG_MAX_SIZE = 30 * 1024 * 1024; // 30MB

    if (file.type.startsWith("video/")) {
      if (!["video/mp4", "video/quicktime"].includes(file.type)) {
        return { isValid: false, error: "비디오는 불가능합니다." };
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
    if (!title.trim()) {
      alert("제목을 입력해주세요.");
      return;
    }

    if (!text.trim()) {
      alert("내용을 입력해주세요.");
      return;
    }

    if (activeTab === "event") {
      if (uploadedImages.length === 0) {
        alert("타임캡슐에는 이미지 첨부가 필수입니다.");
        return;
      }
      if (!selectedDate.year || !selectedDate.month || !selectedDate.day) {
        alert("타임캡슐에는 날짜 지정이 필수입니다.");
        return;
      }
    }

    // 다중 이미지일 경우
    try {
      const channelId = CHANNEL_ID_EVENT;

      // 이미지 파일 base64로 인코딩
      const incodingImages = uploadedImages.map((file) => {
        return new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = () => reject("Base64 인코딩 실패");
          reader.readAsDataURL(file); // Base64 인코딩
        });
      });
      const base64Images = await Promise.all(incodingImages);
      console.log(base64Images);

      // 커스텀 데이터 만들기
      const customData = {
        title: title,
        content: text.split("\n").join("\\n"),
        closeAt: (() => {
          const date = new Date(
            `${selectedDate.year}-${selectedDate.month.padStart(2, "0")}-${selectedDate.day.padStart(2, "0")}`,
          );
          date.setHours(date.getHours() - 9);
          return date.toISOString();
        })(),
        image: base64Images, // 인코딩된 문자열 배열
      };

      const formData = new FormData();
      formData.append("title", JSON.stringify(customData));
      formData.append("channelId", channelId);

      const response = await createPost(formData);
      console.log(response);
      setSaveModal(true);
      if (response?._id) {
        setCreatedPostId(response._id);
        setSaveModal(true);
      }
    } catch (error) {
      console.error("게시물 생성 실패:", error);
    }
  };

  return (
    <div className="relative flex flex-col h-dvh">
      <button className={`py-3 px-6 border-b-2 w-full transition ${"text-[#4D15FF] border-[#4D15FF]"}`}>
        이벤트 타임캡슐
      </button>

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
          {activeTab === "event" && (
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
          className="flex-1 w-full mt-2 overflow-scroll text-gray-600 placeholder-gray-300 whitespace-pre-wrap resize-none h-96 focus:outline-none"
          placeholder={"타임캡슐을 작성해주세요.\n타임캡슐은 이미지 첨부 및 날짜 지정이 필수입니다."}
        />
        <EditPreview
          images={uploadedImages}
          showDatePreview={activeTab === "event"}
          date={selectedDate}
          onDelete={handleDeleteFile}
        />
      </main>
      {showModal && <EventEditModal onClose={() => setShowModal(false)} onSubmit={handleDateSubmit} />}
      {saveModal && (
        <EditComplete
          isOpen={saveModal}
          onClose={() => setSaveModal(false)}
          isTimeCapsule={activeTab === "event"}
          postId={createdPostId!}
        />
      )}
    </div>
  );
}
