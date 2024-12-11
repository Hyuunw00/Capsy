import axiosInstance from "./axiosInstance";

export const CHANNEL_ID_TIMECAPSULE = "67585b36757bff0e678a56a8";
export const CHANNEL_ID_POST = "67585a88757bff0e678a56a3";

// 포스트 생성 API
interface CreatePostRequest {
  title: string;
  channelId: string;
  image?: File;
}

export const createPost = async (data: FormData | CreatePostRequest) => {
  try {
    // 이미지가 있는 경우 => FormData로 전송해야 함
    if (data instanceof FormData) {
      const response = await axiosInstance.post("/posts/create", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    }

    // 이미지가 없는 경우 => JSON로 전송
    const response = await axiosInstance.post("/posts/create", data);
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

// 일반 채널의 포스트 목록 조회 API
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
