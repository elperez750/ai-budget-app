"use client";
import { axiosInstance, API_URL } from "./axios";
import axios from "axios";
import { api } from "./axios"; // Import the axios instance with interceptors
// Types

export interface UserType {
  id: number; // Assuming the backend returns an integer ID for the user
  username: string;
  email: string;
}



export const UserApi = {
  // Special login function (doesn't use the instance with interceptors)
  async login(username: string, password: string) {
    console.log("API login function called");

    console.log("calling login!");
    const response = await axios.post(
      `${API_URL}/api/users/login/`,
      { username, password },
      { withCredentials: true }
    );

    return response.data;
  },

  // Logout function
  async logout() {
    const response = await axiosInstance.post("/api/users/logout/");
    return response.data;
  },

  async getUserProfile() {
    return api.get<UserType>("/api/users/me/");
  },
};
