import { tokenService } from "../utils/token";
import axiosInstance from "./axiosInstance";

export const loginAuth = async (email: string, password: string) => {
  try {
    const response = await axiosInstance.post("/login", { email, password });
    const { token, user } = response.data;

    tokenService.setToken(token);
    tokenService.setUser(user);

    return response;
  } catch (error) {
    throw error;
  }
};

export const userAuth = async () => {
  try {
    const response = await axiosInstance.get("/auth-user");
    return response;
  } catch (error) {
    throw error;
  }
};

export const signupAuth = async (email: string, fullName: string, password: string) => {
  try {
    await axiosInstance.post("/signup", {
      email,
      fullName,
      password,
    });
  } catch (error) {
    throw error;
  }
};

export const userLists = async () => {
  try {
    const response = await axiosInstance.get("/users/get-users");
    return response;
  } catch (error) {
    throw error;
  }
};

export const passwordChangeAuth = async (password: string) => {
  try {
    await axiosInstance.put("/settings/update-password", {
      password,
    });
  } catch (error) {
    throw error;
  }
};
