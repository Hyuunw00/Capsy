import { useNavigate } from "react-router-dom";
import NotificationModal from "../../components/NotificationModal";

interface EditCompleteProps {
  isOpen: boolean;
  onClose: () => void;
  isTimeCapsule: boolean;
  postId: string;
}

const EditComplete = ({ isOpen, onClose, isTimeCapsule, postId }: EditCompleteProps) => {
  const navigate = useNavigate();

  const handleConfirm = () => {
    navigate(`/detail/${postId}`, {
      state: { fromEditor: true },
    });
  };

  if (isTimeCapsule) {
    return (
      <NotificationModal
        isOpen={isOpen}
        title="타임캡슐은 수정할 수 없습니다"
        description={`타임캡슐은 지정한 날짜가 도래하기 전까지\n내용을 수정할 수 없습니다.\n정말 작성을 완료하시겠습니까?`}
      >
        <div className="gap-2 item-between">
          <button onClick={onClose} className="w-full h-10 border border-black dark:border-gray-200 rounded-md">
            취소
          </button>
          <button
            onClick={handleConfirm}
            className="w-full h-10 text-white dark:text-black bg-primary dark:bg-secondary rounded-md hover:opacity-80 transition-opacity duration-200"
          >
            완료
          </button>
        </div>
      </NotificationModal>
    );
  }

  return (
    <NotificationModal
      isOpen={isOpen}
      title="저장이 완료되었습니다"
      description="확인 버튼을 누르면 해당 포스트로 이동합니다"
    >
      <button
        onClick={handleConfirm}
        className="w-full py-2 text-white dark:text-black bg-primary dark:bg-secondary rounded-md hover:opacity-80 transition-opacity duration-200"
      >
        확인
      </button>
    </NotificationModal>
  );
};

export default EditComplete;
