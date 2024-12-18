import flimIcon from "../../assets/film-icon.svg";
import closeIcon from "../../assets/close-white.svg";

interface EditPreviewProps {
  images: File[];
  showDatePreview: boolean;
  date: {
    year: string;
    month: string;
    day: string;
  };
  location?: {
    name: string;
    address: string;
    lat: number;
    lng: number;
  } | null;
  onDelete: (index: number) => void;
}

const EditPreview = ({ images, showDatePreview, date, location, onDelete }: EditPreviewProps) => {
  const isVideo = (file: File) => file.type.startsWith("video/");

  return (
    <ul className="space-y-4">
      {images.length > 0 && (
        <li>
          <h3 className="mb-2 text-black dark:text-white">이미지 미리보기</h3>
          <div className="flex flex-wrap gap-2">
            {images.map((file, index) => (
              <div key={index} className="relative rounded-md shadow-sm">
                <div className="absolute z-10 flex items-center justify-center w-5 h-5 rounded-full bg-bg-500 top-2 left-2">
                  <span className="text-sm text-white">{index + 1}</span>
                </div>
                <button
                  onClick={() => onDelete(index)}
                  className="absolute z-10 flex items-center justify-center w-5 h-5 rounded-full -right-1 -top-2 bg-bg-400"
                >
                  <img src={closeIcon} alt="삭제 버튼" />
                </button>
                {isVideo(file) ? (
                  <div className="relative">
                    <video
                      className="w-[100px] h-[100px] object-cover rounded-md"
                      src={URL.createObjectURL(file)}
                      controls={false}
                      muted
                      autoPlay={false}
                    />
                    <div className="absolute inset-0 flex items-center justify-center rounded-md bg-black/30">
                      <img src={flimIcon} alt="동영상 아이콘" className="w-6 h-6" />
                    </div>
                  </div>
                ) : (
                  <img
                    className="w-[100px] h-[100px] object-cover rounded-md"
                    src={URL.createObjectURL(file)}
                    alt={`업로드 이미지${index + 1}`}
                  />
                )}
              </div>
            ))}
          </div>
        </li>
      )}

      {showDatePreview && date.year && (
        <li className="pr-8 mt-4">
          <h3 className="mb-2 text-black dark:text-white">타임캡슐 오픈 날짜</h3>
          <span className="px-2 py-0.5 rounded-3xl bg-bg-200">
            {date.year} / {date.month} / {date.day}
          </span>
        </li>
      )}

      {location && (
        <li className="pr-8 mt-4">
          <h3 className="mb-2 text-black dark:text-white">선택된 위치</h3>
          <span className="px-2 py-0.5 rounded-3xl bg-bg-200">
            {location.name}
          </span>
        </li>
      )}
    </ul>
  );
};

export default EditPreview;
