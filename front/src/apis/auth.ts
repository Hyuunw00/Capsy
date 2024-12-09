import { tokenService } from '../utils/token';
import axiosInstance from './axiosInstance';

export const loginAuth = async (email: string, password: string) => {
  try {
    const response = await axiosInstance.post('/login', { email, password });
    const { token, user } = response.data;
    
    // 토큰 및 유저 정보 저장
    tokenService.setToken(token);
    tokenService.setUser(user);

    return response.data;
  } catch (error) {
    throw error;
  }
};