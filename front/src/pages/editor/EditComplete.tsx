import NotificationModal from "../../components/NotificationModal";

interface EditCompleteProps {
  isOpen: boolean;
  onClose: () => void;
  isTimeCapsule: boolean;
  onConfirm: () => void;
  isLoading: boolean;
}

const EditComplete = ({ isOpen, onClose, isTimeCapsule, onConfirm, isLoading }: EditCompleteProps) => {
  if (isTimeCapsule) {
    return (
      <NotificationModal
        isOpen={isOpen}
        title="타임캡슐은 수정할 수 없습니다"
        description={`타임캡슐은 지정한 날짜가 도래하기 전까지\n내용을 수정할 수 없습니다.\n정말 작성을 완료하시겠습니까?`}
      >
        <div className="gap-2 item-between">
          <button
            onClick={onClose}
            className="w-full h-10 border border-black rounded-md dark:border-white dark:text-white"
            disabled={isLoading}
          >
            취소
          </button>
          <button
            onClick={onConfirm}
            className="w-full h-10 text-white transition-opacity duration-200 rounded-md bg-primary dark:bg-secondary dark:text-black hover:opacity-80"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white rounded-full border-t-transparent animate-spin" />
              </div>
            ) : (
              "완료"
            )}
          </button>
        </div>
      </NotificationModal>
    );
  }

  return (
    <NotificationModal isOpen={isOpen} title="저장하시겠습니까?" description="확인 버튼을 누르면 포스트가 저장됩니다">
      <button
        onClick={onConfirm}
        className="w-full py-2 text-white dark:text-black transition-opacity duration-200 rounded-md bg-primary dark:bg-secondary hover:opacity-80"
        disabled={isLoading}
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <div className="w-5 h-5 border-2 border-white rounded-full border-t-transparent animate-spin" />
          </div>
        ) : (
          "확인"
        )}
      </button>
    </NotificationModal>
  );
};

export default EditComplete;
