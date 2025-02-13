import React, { useState, useEffect } from "react";
import { Modal } from "../../../components/Modal";
import Button from "../../../components/Button";
import user from "../../../assets/user.png";

interface ProfileImageFormProps {
  onClose: () => void;
  onSave: (image: File) => Promise<void>;
}

const ProfileImageForm: React.FC<ProfileImageFormProps> = ({ onClose, onSave }) => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Preview URL 관리
  useEffect(() => {
    if (selectedImage) {
      const objectUrl = URL.createObjectURL(selectedImage);
      setPreviewUrl(objectUrl);

      return () => URL.revokeObjectURL(objectUrl); // Clean up
    }
  }, [selectedImage]);

  // 파일 변경 핸들러
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      setSelectedImage(files[0]);
      e.target.value = ""; // Reset input
    }
  };

  // 저장 버튼 클릭 핸들러
  const handleSave = async () => {
    if (selectedImage) {
      try {
        await onSave(selectedImage);
        onClose();
      } catch (error) {
        console.error("Failed to save image:", error);
      }
    }
  };

  return (
    <Modal isOpen={true} onClose={onClose}>
      <div className="w-full max-w-md">
        <span className="mb-[60px] mt-[10px] text-[16px] text-center block text-[#000000] dark:text-white">
          프로필 편집
        </span>
        <form className="space-y-4 mb-4">
          <div className="mb-8 cursor-pointer flex flex-col justify-center items-center relative">
            <div className="relative">
              <img
                src={previewUrl || user}
                alt="Profile"
                className="w-[90px] h-[90px] rounded-full object-cover m-auto"
              />
              <input
                type="file"
                id="profileImageInput"
                accept="image/png, image/jpeg, image/gif, image/bmp"
                onChange={handleImageChange}
                className="hidden"
              />
              <label htmlFor="profileImageInput" className="absolute bottom-0 right-0 w-[30px] h-[30px] cursor-pointer">
                <svg viewBox="0 0 31 30" xmlns="http://www.w3.org/2000/svg" fill="none" className="w-full h-full">
                  <circle cx="15.5" cy="15" r="15" className="fill-primary dark:fill-secondary" />
                  <path
                    d="M20.5 14H16.5V10C16.5 9.73478 16.3946 9.48043 16.2071 9.29289C16.0196 9.10536 15.7652 9 15.5 9C15.2348 9 14.9804 9.10536 14.7929 9.29289C14.6054 9.48043 14.5 9.73478 14.5 10V14H10.5C10.2348 14 9.98043 14.1054 9.79289 14.2929C9.60536 14.4804 9.5 14.7348 9.5 15C9.5 15.2652 9.60536 15.5196 9.79289 15.7071C9.98043 15.8946 10.2348 16 10.5 16H14.5V20C14.5 20.2652 14.6054 20.5196 14.7929 20.7071C14.9804 20.8946 15.2348 21 15.5 21C15.7652 21 16.0196 20.8946 16.2071 20.7071C16.3946 20.5196 16.5 20.2652 16.5 20V16H20.5C20.7652 16 21.0196 15.8946 21.2071 15.7071C21.3946 15.5196 21.5 15.2652 21.5 15C21.5 14.7348 21.3946 14.4804 21.2071 14.2929C21.0196 14.1054 20.7652 14 20.5 14Z"
                    className="fill-white dark:fill-black"
                  />
                </svg>
              </label>
            </div>
            <span className="block mt-10 text-[14px] text-black dark:text-white">사진 수정</span>
          </div>

          <div className="mt-4">
            <Button
              type="button"
              onClick={handleSave}
              className="w-full py-3 text-white dark:text-black bg-primary dark:bg-secondary rounded-md hover:opacity-80 transition-opacity duration-200"
            >
              저장하기
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default ProfileImageForm;
