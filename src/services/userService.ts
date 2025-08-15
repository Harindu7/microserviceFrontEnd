import { User, UserDTO } from '../types';
import { userApi, handleApiError, processResponse } from './api';

export const UserService = {
    getAll: async (): Promise<User[]> => {
        try {
            const response = await userApi.get('/api/users');
            return processResponse(response);
        } catch (error) {
            throw handleApiError(error);
        }
    },

    getById: async (id: string): Promise<User> => {
        try {
            const response = await userApi.get(`/api/users/${id}`);
            return processResponse(response);
        } catch (error) {
            throw handleApiError(error);
        }
    },

    create: async (user: UserDTO): Promise<User> => {
        try {
            const response = await userApi.post('/api/users', user);
            return processResponse(response);
        } catch (error) {
            throw handleApiError(error);
        }
    },

    update: async (id: string, user: UserDTO): Promise<User> => {
        try {
            const response = await userApi.put(`/api/users/${id}`, user);
            return processResponse(response);
        } catch (error) {
            throw handleApiError(error);
        }
    },

    deactivate: async (id: string): Promise<User> => {
        try {
            const response = await userApi.patch(`/api/users/${id}/deactivate`);
            return processResponse(response);
        } catch (error) {
            throw handleApiError(error);
        }
    }
};
