import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import pictureIcon from "../../assets/pick-picture-icon.svg";
import dateIcon from "../../assets/pick-date-icon.svg";
import EditPreview from "./EditPreview";
import EditComplete from "./EditComplete";
import { createPost } from "../../apis/apis";
import { CHANNEL_ID_EVENT } from "../../apis/apis";
import EventEditModal from "./EventEditModal";
import NotificationModal from "../../components/NotificationModal";
import { compressImage, convertFileToBase64, validateBase64Size } from "./imageUtils";

export default function EventEditorPage() {
  const navigate = useNavigate();
  const activeTab = "event";
  const [showModal, setShowModal] = useState(false);
  const [saveModal, setSaveModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [notificationModal, setNotificationModal] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
  }>({
    isOpen: false,
    title: "",
    description: "",
  });

  // 업로드 받은 이미지 상태
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);

  // 타임캡슐 날짜 상태
  const [selectedDate, setSelectedDate] = useState({
    year: "",
    month: "",
    day: "",
  });

  const handleCloseModal = () => {
    setNotificationModal({
      isOpen: false,
      title: "",
      description: "",
    });
  };

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
        setNotificationModal({
          isOpen: true,
          title: "파일 오류",
          description: validation.error || "파일 검증에 실패했습니다.",
        });
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
  const handleSaveClick = () => {
    if (!title.trim()) {
      setNotificationModal({
        isOpen: true,
        title: "입력 오류",
        description: "제목을 입력해주세요.",
      });
      return;
    }

    if (!text.trim()) {
      setNotificationModal({
        isOpen: true,
        title: "입력 오류",
        description: "내용을 입력해주세요.",
      });
      return;
    }

    if (uploadedImages.length === 0) {
      setNotificationModal({
        isOpen: true,
        title: "필수 항목 누락",
        description: "타임캡슐에는 이미지 첨부가 필수입니다.",
      });
      return;
    }

    if (!selectedDate.year || !selectedDate.month || !selectedDate.day) {
      setNotificationModal({
        isOpen: true,
        title: "필수 항목 누락",
        description: "타임캡슐에는 날짜 지정이 필수입니다.",
      });
      return;
    }

    // 유효성 검사 통과 시 저장 모달 표시
    setSaveModal(true);
  };

  const handleConfirmSave = async () => {
    setIsLoading(true);
    try {
      const channelId = CHANNEL_ID_EVENT;

      // 이미지 파일 base64로 인코딩
      const incodingImages = await Promise.all(
        uploadedImages.map(async (file) => {
          const base64 = file.type.startsWith("image/") ? await compressImage(file) : await convertFileToBase64(file);
          const validation = validateBase64Size(base64);
          if (!validation.isValid) {
            throw new Error(validation.error);
          }
          return base64;
        }),
      );

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
        image: incodingImages,
      };

      const formData = new FormData();
      formData.append("title", JSON.stringify(customData));
      formData.append("channelId", channelId);

      const response = await createPost(formData);
      if (response?._id) {
        navigate(`/detail/${response._id}`, {
          state: { fromEditor: true },
        });
      }
    } catch (error) {
      setIsLoading(false);
      setSaveModal(false);
      setNotificationModal({
        isOpen: true,
        title: "저장 실패",
        description: error instanceof Error ? error.message : "저장 중 오류가 발생했습니다.",
      });
      console.error("게시물 생성 실패:", error);
    }
  };

  return (
    <div className="relative flex flex-col h-dvh">
      <button className="w-full px-6 py-3 transition border-b-2 text-primary dark:text-secondary border-primary dark:border-secondary">
        이벤트 타임캡슐
      </button>

      <nav className="flex items-center justify-between px-4 py-3 border-b border-b-gray-100 dark:border-b-gray-500">
        <div className="flex items-center gap-4">
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/jpeg,image/png,video/mp4,video/quicktime"
            onChange={handleFileChange}
            multiple
          />
          <button
            onClick={handlePictureClick}
            className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded dark:bg-gray-300"
          >
            <img src={pictureIcon} alt="사진 선택 아이콘" />
          </button>
          <button
            className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded dark:bg-gray-300"
            onClick={() => setShowModal(true)}
          >
            <img src={dateIcon} alt="날짜 지정 아이콘" />
          </button>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={handleSaveClick}
            className="px-4 py-1 text-sm text-white rounded dark:text-black bg-primary dark:bg-secondary"
          >
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
            className="w-full text-gray-600 placeholder-gray-300 bg-white resize-none h-7 focus:outline-none dark:bg-black dark:text-gray-100"
          />
        </h2>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 w-full mt-2 overflow-x-hidden overflow-y-scroll text-gray-600 placeholder-gray-300 whitespace-pre-wrap bg-white resize-none h-96 focus:outline-none dark:bg-black dark:text-gray-100"
          placeholder={'타임캡슐을 작성해주세요.\n타임캡슐은 이미지 첨부 및 날짜 지정이 필수입니다.'}
        />
        <EditPreview images={uploadedImages} showDatePreview={true} date={selectedDate} onDelete={handleDeleteFile} />
      </main>
      {showModal && <EventEditModal onClose={() => setShowModal(false)} onSubmit={handleDateSubmit} />}
      {saveModal && (
        <EditComplete
          isOpen={saveModal}
          onClose={() => setSaveModal(false)}
          isTimeCapsule={true}
          onConfirm={handleConfirmSave}
          isLoading={isLoading}
        />
      )}
      {/* 기존 알림 모달 - 유지 */}
      <NotificationModal
        isOpen={notificationModal.isOpen}
        title={notificationModal.title}
        description={notificationModal.description}
      >
        <button
          onClick={handleCloseModal}
          className="w-full px-4 py-2 text-white transition-opacity duration-200 rounded-md dark:text-black bg-primary dark:bg-secondary hover:opacity-80"
        >
          확인
        </button>
      </NotificationModal>

      {/* 이벤트 캡슐 수정 불가 모달 - 추가 */}
      <NotificationModal isOpen={showEventModal} title="수정 불가" description="이벤트 캡슐은 수정이 불가능합니다">
        <button
          onClick={() => setShowEventModal(false)}
          className="w-full px-4 py-2 text-white transition-opacity duration-200 rounded-md dark:text-black bg-primary dark:bg-secondary hover:opacity-80"
        >
          확인
        </button>
      </NotificationModal>
    </div>
  );
}
