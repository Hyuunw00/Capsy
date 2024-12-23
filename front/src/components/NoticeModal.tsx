import React from "react";

interface NoticeModalProps {
  title: string | null;
  children: React.ReactNode;
  onClose: () => void;
}

const NoticeModal = ({ title, children, onClose }: NoticeModalProps) => {
  return (
    <div className="relative">
      <div className="fixed inset-0 z-40 bg-black/30" />
      <div className="absolute top-2/4 left-2/4 -translate-x-1/2 -translate-y-1/2 shadow-md z-50 w-[350px] p-4 bg-white dark:bg-gray-700 rounded-lg">
        <h5 className="mb-3 text-center text-black dark:text-white">{title}</h5>
        <p className="mb-4 text-center dark:text-gray-200">{children}</p>
        <button
          onClick={onClose}
          className="w-full py-2 text-white rounded dark:text-black bg-primary dark:bg-secondary"
        >
          확인
        </button>
      </div>
    </div>
  );
};

export default NoticeModal;
