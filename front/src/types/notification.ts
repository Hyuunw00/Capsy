export interface Notification {
  type: "COMMENT" | "FOLLOW" | "LIKE" | "MESSAGE";
  userId: string;
  postId?: string;
  notificationTypeId: string;
  user?: {
    fullName: string;
  };
}

export interface NotifyModalProps {
  isVisible: boolean;
  notifications: Notification[];
  onAcceptFollow: (notification: Notification) => void;
  onRejectFollow: (notification: Notification) => void;
  onReadNotification: (notification: Notification) => void;
  onMoveToPost: (notification: Notification) => void;
}