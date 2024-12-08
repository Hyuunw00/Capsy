type ModalProps = {
    isOpen: boolean;
    onClose?: () => void;
    children: React.ReactNode;
  };

export default function NotificationModal({isOpen,onClose,children}:ModalProps) {
 
  if (!isOpen) return null;
  return (
    <>
    {isOpen &&<div className="fixed inset-0 z-40 bg-black/30" onClick={onClose}>
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30 rounded-md flex flex-col justify-between items-center bg-white w-[350px]   ">
            <div className="py-[24px] px-[16px]">
                {children}
            </div>
        </div>
    </div>
    }
  
</>
  )
}