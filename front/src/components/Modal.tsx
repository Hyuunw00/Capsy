type ModalProps = {
  isOpen: boolean;
  onClose?: () => void;
  children: React.ReactNode;
};

export const Modal = ({ isOpen, onClose, children }: ModalProps) => {
  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed bottom-0 left-0 right-0 mx-auto max-w-[600px] inset-0 z-40 bg-black/30"
        onClick={onClose}
      />
      <div className="fixed bottom-0 left-0 right-0 mx-auto max-w-[600px]
       bg-white rounded-t-[20px] px-8 py-4 z-50 flex flex-col items-center">
        {children}
      </div>
    </>
  );
};