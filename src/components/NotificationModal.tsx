export interface NotificationModalProps {
  isOpen: boolean;
  title: string;
  description: string;
  children: React.ReactNode;
}

export default function NotificationModal({ isOpen, title, description, children }: NotificationModalProps) {
  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/30" />
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
        <div className=" flex-shrink-0  p-6 bg-white dark:bg-gray-700 rounded-lg min-w-96">
          <h2 className="mb-4 text-xl font-medium text-center dark:text-white">{title}</h2>
          <p className="mb-6 text-center text-gray-600 dark:text-gray-200 whitespace-pre-line">{description}</p>
          <div className="flex flex-col gap-2">{children}</div>
        </div>
      </div>
    </>
  );
}
