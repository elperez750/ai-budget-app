import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';



export const API_URL = process.env.NEXT_PUBLIC_API_URL;


export const axiosInstance: AxiosInstance = axios.create({
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
      }
    };