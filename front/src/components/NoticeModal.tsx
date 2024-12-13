import React from "react";

interface NoticeModalProps {
  title: string | null;
  children: React.ReactNode;
  onClose: () => void;
}

const NoticeModal = ({ title, children, onClose }: NoticeModalProps) => {
  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/30" />
      <div className="absolute top-32 left-12 shadow-md z-50 w-[80%] p-4 bg-white rounded-lg">
        <h5 className="mb-3 text-black">{title}</h5>
        <p className="mb-4">{children}</p>
        <button onClick={onClose} className="w-full py-2 text-white bg-black rounded">
          확인
        </button>
      </div>
    </>
  );
};

export default NoticeModal;
