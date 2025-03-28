import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import { useRouter } from "next/navigation";

const API_URL = 'http://127.0.0.1:8000/';

const router = useRouter()

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
                    `${API_URL}/api/users/refresh`,
                    {},
                    { withCredentials: true}
                );

                return axiosInstance(originalRequest)
            } catch(refreshError) {
                router.push('/auth')
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

    
}