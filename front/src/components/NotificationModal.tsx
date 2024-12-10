type ModalProps = {
  onClose?: () => void;
  title: string | null;
};

export default function NotificationModal({ title, onClose }: ModalProps) {
  return (
    <>
      <div className="absolute top-32 left-12 shadow-md z-50 w-[80%] p-4 bg-white rounded-lg">
        <h5 className="mb-3 text-primary">{title}</h5>
        <button onClick={onClose} className="w-full py-2 text-white rounded bg-primary">
          확인
        </button>
      </div>
    </>
  );
}
