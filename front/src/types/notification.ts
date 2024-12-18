export interface Notification {
  type: "COMMENT" | "FOLLOW" | "LIKE" | "MESSAGE";
  userId: string;
  postId?: string;
  notificationTypeId: string;
  user?: {
    fullName: string;
  };
  follow?: {
    _id: string;
    user: string;
    follower: string;
    createdAt: string;
    updatedAt: string;
  };
  postTitle?: string;
}

export interface NotifyModalProps {
  isVisible: boolean;
  notifications: Notification[];
  followerNames: {[key: string]: string};
  onAcceptFollow: (notification: Notification) => void;
  onRejectFollow: (notification: Notification) => void;
  onReadNotification: (notification: Notification) => void;
  onMoveToPost: (notification: Notification) => void;
}