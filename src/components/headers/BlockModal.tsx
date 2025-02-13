type BlockModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const BlockModal = ({ isOpen, onClose }: BlockModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] w-full h-screen bg-black/30 flex flex-col item-middle" onClick={onClose}>
      <div className="flex flex-col items-center p-8 bg-white rounded-lg dark:bg-gray-600 w-fit">
        <h2 className="mb-4 text-xl font-medium text-center dark:text-white">접근 제한</h2>
        <p className="mb-6 text-center text-gray-600 dark:text-gray-200">아직 공개되지 않은 타임캡슐입니다.</p>
        <button
          onClick={onClose}
          className="w-full px-4 py-2 text-white bg-black rounded-md dark:bg-white dark:text-black"
        >
          확인
        </button>
      </div>
    </div>
  );
};
