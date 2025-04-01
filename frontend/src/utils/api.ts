"use client"

import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import { useRouter } from "next/navigation";
// Types
export interface UserType {
    username: string;
    email: string;
  }

  
const API_URL = 'http://localhost:8000';




const axiosInstance: AxiosInstance = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    },
})


axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => response,

    async (error: AxiosError) => {
        const originalRequest: any = error.config

        if (error.response?.status === 401 && !originalRequest._retry){
            originalRequest._retry = true;

            try {
                await axios.post(
                    `${API_URL}/api/users/refresh/`,
                    {},
                    { withCredentials: true}
                );

                return axiosInstance(originalRequest)
            } catch(refreshError) {
                return Promise.reject(refreshError);

            }

        
        }

        return Promise.reject(error)
    }
)




export const api = {
    async get<T>(endpoint: string): Promise<T> {
        const response = await axiosInstance.get<T>(endpoint);
        return response.data
    },


    async post<T>(endpoint: string, data:any): Promise<T> {
        const response = await axiosInstance.post<T>(endpoint, data);
        return response.data
    },

    async put<T>(endpoint: string, data: any): Promise<T> {
        const response = await axiosInstance.put<T>(endpoint, data);
        return response.data;
      },
      
      async delete<T>(endpoint: string): Promise<T> {
        const response = await axiosInstance.delete<T>(endpoint);
        return response.data;
      },
      
      // Special login function (doesn't use the instance with interceptors)
      async login(username: string, password: string) {
        console.log("API login function called");

        console.log("calling login!")
        const response = await axios.post(
          `${API_URL}/api/users/login/`,
          { username, password },
          { withCredentials: true }
        );
        
        console.log(response.data)
        return response.data;
      },
      
      // Logout function
      async logout() {
        const response = await axiosInstance.post('/api/users/logout/');
        return response.data;
      },
      


      async getUserProfile(){
        return this.get<UserType>('/api/users/me/')
      }
    };

    