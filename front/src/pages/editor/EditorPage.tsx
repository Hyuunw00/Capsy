import { useRef, useState } from "react";
import pictureIcon from "../../assets/pick-picture-icon.svg";
import dateIcon from "../../assets/pick-date-icon.svg";
import locationIcon from "../../assets/location-icon.svg";
import EditModal from "./EditModal";
import EditPreview from "./EditPreview";
import EditComplete from "./EditComplete";
import { createPost } from "../../apis/apis";
import { CHANNEL_ID_TIMECAPSULE, CHANNEL_ID_POST } from "../../apis/apis";
import EditLocationModal from "./EditLocationModal";
import NotificationModal from "../../components/NotificationModal";
import { validateBase64Size, compressImage, convertFileToBase64 } from './imageUtils';
import { useNavigate } from "react-router";

export default function EditorPage() {
  const [activeTab, setActiveTab] = useState("general");
  const [showModal, setShowModal] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [saveModal, setSaveModal] = useState(false);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [createdPostId, setCreatedPostId] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<{
    name: string;
    address: string;
    lat: number;
    lng: number;
  } | null>(null);

  const [uploadedImages, setUploadedImages] = useState<File[]>([]);

  const [selectedDate, setSelectedDate] = useState({
    year: "",
    month: "",
    day: "",
  });

  const [notificationModal, setNotificationModal] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
  }>({
    isOpen: false,
    title: "",
    description: "",
  });

  const handleCloseModal = () => {
    setNotificationModal({
      isOpen: false,
      title: "",
      description: "",
    });
  };

  const handleDeleteFile = (indexToDelete: number) => {
    setUploadedImages((prev) => prev.filter((_, index) => index !== indexToDelete));
  };

  const handlePictureClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
  
    try {
      for (const file of files) {
        const base64 = file.type.startsWith('image/') 
          ? await compressImage(file)
          : await convertFileToBase64(file);

        const validation = validateBase64Size(base64);
        if (!validation.isValid) {
          setNotificationModal({
            isOpen: true,
            title: "파일 크기 초과",
            description: "파일의 용량이 너무 큽니다.\n비디오는 4GB 이하, 이미지는 10MB 이하만 업로드 가능합니다."
          });
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
          return;
        }
      }
  
      setUploadedImages((prev) => [...prev, ...files]);
    } catch (error) {
      setNotificationModal({
        isOpen: true,
        title: "파일 처리 오류",
        description: "파일 처리 중 오류가 발생했습니다.\n다시 시도해 주세요."
      });
      console.error("File processing error:", error);
    }
  
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDateSubmit = (date: { year: string; month: string; day: string }) => {
    setSelectedDate(date);
    setShowModal(false);
  };

  const handleSaveClick = async () => {
    if (!title.trim()) {
      setNotificationModal({
        isOpen: true,
        title: "입력 오류",
        description: "제목을 입력해주세요."
      });
      return;
    }
  
    if (!text.trim()) {
      setNotificationModal({
        isOpen: true,
        title: "입력 오류",
        description: "내용을 입력해주세요."
      });
      return;
    }
  
    if (activeTab === "timeCapsule") {
      if (uploadedImages.length === 0) {
        setNotificationModal({
          isOpen: true,
          title: "필수 항목 누락",
          description: "타임캡슐에는 이미지 첨부가 필수입니다."
        });
        return;
      }
      if (!selectedDate.year || !selectedDate.month || !selectedDate.day) {
        setNotificationModal({
          isOpen: true,
          title: "필수 항목 누락",
          description: "타임캡슐에는 날짜 지정이 필수입니다."
        });
        return;
      }
    }
  
    try {
      const channelId = activeTab === "timeCapsule" ? CHANNEL_ID_TIMECAPSULE : CHANNEL_ID_POST;
  
      const incodingImages = await Promise.all(uploadedImages.map(async (file) => {
        const base64 = file.type.startsWith('image/')
          ? await compressImage(file)
          : await convertFileToBase64(file);
  
        const validation = validateBase64Size(base64);
        if (!validation.isValid) {
          throw new Error(validation.error);
        }
  
        return base64;
      }));
  
      const customData = {
        title: title,
        content: text.split("\n").join("\\n"),
        ...(activeTab === "timeCapsule" && {
          closeAt: (() => {
            const date = new Date(
              `${selectedDate.year}-${selectedDate.month.padStart(2, "0")}-${selectedDate.day.padStart(2, "0")}`,
            );
            date.setHours(date.getHours() - 9);
            return date.toISOString();
          })(),
        }),
        image: incodingImages,
        ...(selectedLocation && {
          capsuleLocation: selectedLocation.name,
          latitude: selectedLocation.lat,
          longitude: selectedLocation.lng
        })
      };
  
      const formData = new FormData();
      formData.append("title", JSON.stringify(customData));
      formData.append("channelId", channelId);
  
      const response = await createPost(formData);
  
      if (response?._id) {
        setCreatedPostId(response._id);
        setSaveModal(true);

      }
    } catch (error) {
      setNotificationModal({
        isOpen: true,
        title: "네트워크 에러",
        description: error instanceof Error 
          ? error.message 
          : "네트워크 오류가 발생했습니다.\n잠시 후 다시 시도해주세요."
      });
      console.error("게시물 생성 실패:", error);
      return;
    }
  };
     
  const handleLocationSelect = (location: { name: string; address: string; lat: number; lng: number }) => {
    setSelectedLocation(location);
    setShowLocationModal(false);
  };

  return (
    <div className="relative flex flex-col h-dvh">
      <nav className="border-b">
        <div className="flex items-center">
          <button
            className={`py-3 px-6 border-b-2 w-1/2 transition ${
              activeTab === "general"
                ? "text-primary border-primary dark:text-secondary dark:border-secondary"
                : "text-gray-400 border-transparent dark:text-gray-200"
            }`}
            onClick={() => setActiveTab("general")}
          >
            일반 포스트
          </button>
          <button
            className={`py-3 px-6 border-b-2 w-1/2 transition ${
              activeTab === "timeCapsule"
                ? "text-primary border-primary dark:text-secondary dark:border-secondary"
                : "text-gray-400 border-transparent dark:text-gray-200"
            }`}
            onClick={() => setActiveTab("timeCapsule")}
          >
            타임캡슐
          </button>
        </div>
      </nav>
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
          <button onClick={handlePictureClick} className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded dark:bg-gray-300">
            <img src={pictureIcon} alt="사진 선택 아이콘" />
          </button>

          {activeTab === "timeCapsule" && (
            <button
              className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded dark:bg-gray-300"
              onClick={() => setShowModal(true)}
            >
              <img src={dateIcon} alt="날짜 지정 아이콘" />
            </button>
          )}

          {activeTab === "timeCapsule" && (
            <button
              className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded dark:bg-gray-300"
              onClick={() => setShowLocationModal(true)}
            >
              <img src={locationIcon} alt="위치 지정 아이콘" />
            </button>
          )}
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={handleSaveClick}
            className="px-4 py-1 text-sm text-white bg-black rounded dark:bg-secondary dark:text-black"
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
          location={selectedLocation}
          onDelete={handleDeleteFile}
        />
      </main>
      {showModal && <EditModal onClose={() => setShowModal(false)} onSubmit={handleDateSubmit} />}
      {showLocationModal && (
        <EditLocationModal onClose={() => setShowLocationModal(false)} onSelectLocation={handleLocationSelect} />
      )}
      {saveModal && (
        <EditComplete
          isOpen={saveModal}
          onClose={() => setSaveModal(false)}
          isTimeCapsule={activeTab === "timeCapsule"}
          postId={createdPostId!}
        />
      )}
      <NotificationModal
        isOpen={notificationModal.isOpen}
        title={notificationModal.title}
        description={notificationModal.description}
      >
        <button
          onClick={handleCloseModal}
          className="w-full px-4 py-2 text-white bg-black rounded-md"
        >
          확인
        </button>
      </NotificationModal>
    </div>
  );
}