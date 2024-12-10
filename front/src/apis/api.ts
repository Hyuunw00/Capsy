import axiosInstance from "./axiosInstance";

interface CreatePostTypes {
  title: string;
  image?: File | null;
  channelId: string;
}

export const createPost = async (data: CreatePostTypes) => {
  try {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('channelId', data.channelId);
    
    if (data.image) {
      formData.append('image', data.image);
    }

    const response = await axiosInstance.post('/posts', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};