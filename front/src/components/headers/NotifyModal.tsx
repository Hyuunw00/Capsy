interface NotifyModalProps {
  username: string;
  content: string;
  children?: React.ReactNode;
  className?: string;
  isVisible: boolean;  // 추가
}

const NotifyModal = ({ username, content, children, className, isVisible }: NotifyModalProps) => {
  return (
    <div 
      className={`absolute top-[62px] left-8 shadow-md z-50 w-[90%] p-4 bg-white rounded-lg
        transition-all duration-300 ease-in-out transform
        ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'}
        ${className || ''}`}
    >
      <h5 className="mb-3 text-primary">{username}</h5>
      <div className="item-between">
        <p className="">{content}</p>
        {children}
      </div>
    </div>
  );
};


export default NotifyModal;