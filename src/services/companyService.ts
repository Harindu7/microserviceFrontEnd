import { Company, CompanyDTO } from '../types';
import { companyApi, handleApiError, processResponse } from './api';

export const CompanyService = {
    getAll: async (): Promise<Company[]> => {
        try {
            const response = await companyApi.get('/api/companies');
            return processResponse(response);
        } catch (error) {
            throw handleApiError(error);
        }
    },

    getById: async (id: string): Promise<Company> => {
        try {
            const response = await companyApi.get(`/api/companies/${id}`);
            return processResponse(response);
        } catch (error) {
            throw handleApiError(error);
        }
    },

    create: async (company: CompanyDTO): Promise<Company> => {
        try {
            const response = await companyApi.post('/api/companies', company);
            return processResponse(response);
        } catch (error) {
            throw handleApiError(error);
        }
    },

    update: async (id: string, company: CompanyDTO): Promise<Company> => {
        try {
            const response = await companyApi.put(`/api/companies/${id}`, company);
            return processResponse(response);
        } catch (error) {
            throw handleApiError(error);
        }
    },

    deactivate: async (id: string): Promise<Company> => {
        try {
            const response = await companyApi.patch(`/api/companies/${id}/deactivate`);
            return processResponse(response);
        } catch (error) {
            throw handleApiError(error);
        }
    }
};
