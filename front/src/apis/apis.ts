import axiosInstance from "./axiosInstance";

export const CHANNEL_ID_TIMECAPSULE = "67585b36757bff0e678a56a8";
export const CHANNEL_ID_POST = "67585a88757bff0e678a56a3";

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
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Channel ----------------------------------------------------------------------

// 타임캡슐 채널의 포스트 목록 조회 API
export const getTimeCapsuleChannel = async () => {
  try {
    const response = await axiosInstance.get(`/posts/channel/${CHANNEL_ID_TIMECAPSULE};
    }`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 일반 채널의 포스트 목록 조회 API
export const getPostChannel = async () => {
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

// 알림 생성 API
export const createNotifications = async () => {
  try {
    const response = await axiosInstance.get(`/notifications/create`);
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
