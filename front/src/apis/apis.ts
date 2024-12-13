import axiosInstance from "./axiosInstance";

export const CHANNEL_ID_TIMECAPSULE = "675c3793afaf9312bedbccd3";
export const CHANNEL_ID_POST = "675c379fafaf9312bedbccd7";

// Post -------------------------------------------------------------------------

// 포스트 생성 API
export const createPost = async (data: FormData) => {
  try {
    const response = await axiosInstance.post("/posts/create", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 포스트 수정 API
export const updatePost = async (data: PostDataType) => {
  try {
    const response = await axiosInstance.put("posts/update", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

interface PostDataType {
  postId: string;
  title: string;
}

// 포스트 삭제 API
export const deletePost = async (postId: string) => {
  try {
    const response = await axiosInstance.delete("posts/delete", {
      data: {
        id: postId,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 특정 사용자의 포스트 목록 조회 API
export const getUserPosts = async (authorId: string) => {
  try {
    const response = await axiosInstance.get(`/posts/author/${authorId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 특정 포스트 상세 보기 API
export const getPostDetail = async (postId: string) => {
  try {
    const response = await axiosInstance.get(`/posts/${postId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Comments --------------------------------------------------------------------

// 특정 포스트에 댓글 달기 API
export const createComment = async (data: any) => {
  try {
    const response = await axiosInstance.post(`/comments/create`, data);

    // 댓글 작성 후 알림 생성
    await createNotifications({
      notificationType: "COMMENT",
      notificationTypeId: response.data._id,
      userId: response.data.author._id,
      postId: response.data.post,
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};
export const deleteComment = async (commentId: string) => {
  try {
    const response = await axiosInstance.delete("/comments/delete", {
      data: { id: commentId }, // API 요구사항에 맞춰 댓글 id 전송
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
// Channel ----------------------------------------------------------------------

// 타임캡슐 채널의 포스트 목록 조회 API
export const getTimeCapsuleChannel = async (CHANNEL_ID_TIMECAPSULE: string) => {
  try {
    const response = await axiosInstance.get(`/posts/channel/${CHANNEL_ID_TIMECAPSULE};
    }`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 일반 채널의 포스트 목록 조회 API
export const getPostChannel = async (CHANNEL_ID_POST: string) => {
  try {
    const response = await axiosInstance.get(`/posts/channel/${CHANNEL_ID_POST};
    }`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Notifications ---------------------------------------------------------------

// 알림 목록 가져오기 API
export const getNotifications = async () => {
  try {
    const response = await axiosInstance.get(`/notifications`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 알림 확인 API
export const seenNotifications = async () => {
  try {
    const response = await axiosInstance.get(`/notifications/seen`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 알림 생성 API
export const createNotifications = async (data: NotificationsProps) => {
  try {
    const response = await axiosInstance.post(`/notifications/create`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

interface NotificationsProps {
  notificationType: "COMMENT" | "FOLLOW" | "LIKE" | "MESSAGE";
  notificationTypeId: string;
  userId: string;
  postId: string | null;
}

// Follow  ---------------------------------------------------------------

// 팔로우 맺기 API
export const followUser = async (userId: string) => {
  try {
    const response = await axiosInstance.post(`/follow/create`, userId);

    // 댓글 작성 후 알림 생성
    await createNotifications({
      notificationType: "COMMENT",
      notificationTypeId: response.data._id,
      userId: response.data.author._id,
      postId: response.data.post,
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

// 팔로우 취소 API
export const unFollowUser = async (id: string) => {
  try {
    const response = await axiosInstance.delete("/follow/delete", {
      data: { id },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

//사용자 정보 가져오기 API
export const getMyProfile = async () => {
  try {
    const response = await axiosInstance.get("/auth-user");
    return response.data;
  } catch (error) {
    throw error;
  }
};
