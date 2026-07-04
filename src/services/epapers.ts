import { apiClient } from './apiClient';
import type { ApiResponse, PaginationParams } from './apiClient';

// Types for E-Papers
export interface EPaper {
    id: string;
    title: string;
    language: 'english' | 'hindi';
    date: string;
    pdfUrl: string;
    thumbnailUrl?: string;
    pageCount: number;
    isPublished: boolean;
    viewCount: number;
    downloadCount: number;
    createdAt: string;
    updatedAt: string;
}

export interface EPaperFilters extends PaginationParams {
    language?: 'english' | 'hindi';
    dateFrom?: string;
    dateTo?: string;
    isPublished?: boolean;
    status?: string;
    startDate?: string;
    endDate?: string;
    [key: string]: unknown;
}

export interface EPapersResponse {
    success: boolean;
    epapers: EPaper[];
    pagination?: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    };
}

// E-Paper API functions
export const epapersApi = {
    // Get today's e-paper
    getTodayEPaper: async (language?: 'english' | 'hindi'): Promise<ApiResponse<EPaper>> => {
        const languageParam = language ? language.toUpperCase() : 'ENGLISH';
        return apiClient.get<EPaper>('/epapers/today', { language: languageParam });
    },

    // Get e-paper by ID
    getEPaper: async (id: string): Promise<ApiResponse<EPaper>> => {
        return apiClient.get<EPaper>(`/epapers/${id}`);
    },

    // Get e-papers with filters (for archive page)
    getEPapers: async (filters?: EPaperFilters): Promise<EPaper[]> => {
        const response = await apiClient.get<EPapersResponse>('/epapers', filters);
        // Backend returns { success: true, epapers: [...], pagination: {...} }
        return (response as any).epapers || [];
    },

    // Get last N days of e-papers
    getRecentEPapers: async (days: number = 14, language?: 'english' | 'hindi'): Promise<EPaper[]> => {
        const dateTo = new Date();
        const dateFrom = new Date();
        dateFrom.setDate(dateFrom.getDate() - days);

        const params: any = {
            startDate: dateFrom.toISOString().split('T')[0],
            endDate: dateTo.toISOString().split('T')[0],
            sortBy: 'date',
            sortOrder: 'desc',
            limit: 100, // Get all papers within the date range
        };

        if (language) {
            params.language = language.toUpperCase();
        }

        const response = await apiClient.get<EPapersResponse>('/epapers', params);
        return (response as any).epapers || [];
    },
};
