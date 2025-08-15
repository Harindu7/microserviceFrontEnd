import axios, { AxiosError, AxiosResponse } from 'axios';

const USER_API_URL = import.meta.env.VITE_USER_API_URL || 'http://user-service:8080';
const COMPANY_API_URL = import.meta.env.VITE_COMPANY_API_URL || 'http://company-service:8081';

const userApi = axios.create({
    baseURL: USER_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

const companyApi = axios.create({
    baseURL: COMPANY_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const handleApiError = (error: unknown): never => {
    if (error instanceof AxiosError) {
        const message = error.response?.data?.message || error.message;
        throw new Error(`API Error: ${message}`);
    }
    throw new Error('An unexpected error occurred');
};

export const processResponse = <T>(response: AxiosResponse<T>): T => {
    return response.data;
};

export { userApi, companyApi };
