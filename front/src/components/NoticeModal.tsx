import React, { Children } from "react";

interface NoticeModalProps {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}

const NoticeModal = ({ title, children, onClose }: NoticeModalProps) => {
  return (
      <div className="absolute top-32 left-12 shadow-md z-50 w-[80%] p-4 bg-white rounded-lg">
        <h5 className="mb-3 text-primary">{title}</h5>
        <p className="mb-4">{children}</p>
        <button 
          onClick={onClose}
          className="w-full py-2 text-white rounded bg-primary"
        >
          확인
        </button>
      </div>
  );
};

export default NoticeModal;
