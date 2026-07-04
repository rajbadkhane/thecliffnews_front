import { apiClient } from './apiClient';
import type { ApiResponse, PaginationParams } from './apiClient';

// Types for Articles - Updated to match backend schema
export interface Article {
    id: string;
    title: string;
    slug: string;
    excerpt?: string;
    content: string;
    author: {
        name: string;
        email?: string;
    };
    category: {
        name: string;
        slug: string;
        color: string;
    };
    publishedAt?: string;
    featuredImage?: string;
    readTime?: number;
    isBreaking: boolean;
    isTopStory: boolean; // Backend uses isTopStory instead of isFeatured
    metaTitle?: string;
    metaDescription?: string;
    ogImage?: string;
    tags?: string; // Backend stores as comma-separated string
    quickRead?: string; // Backend has quickRead field
    status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'; // Backend uses uppercase
    viewCount: number;
    shareCount: number;
    createdAt: string;
    updatedAt: string;
    language: 'ENGLISH' | 'HINDI'; // Backend uses uppercase enum
    authorId: string;
    categoryId: string;
}

export interface ArticleFilters extends PaginationParams {
    category?: string;
    author?: string;
    status?: string;
    isBreaking?: boolean;
    isFeatured?: boolean;
    search?: string;
    dateFrom?: string;
    dateTo?: string;
    language?: 'en' | 'hi';
    [key: string]: unknown;
}

export interface CreateArticleData {
    title: string;
    excerpt: string;
    content: string;
    featuredImage?: string;
    categoryId: string;
    isFeatured?: boolean;
    isBreaking?: boolean;
    tags?: string[];
    language?: 'en' | 'hi';
}

export interface UpdateArticleData {
    id: string;
    title?: string;
    excerpt?: string;
    content?: string;
    featuredImage?: string;
    categoryId?: string;
    isFeatured?: boolean;
    isBreaking?: boolean;
    tags?: string[];
    language?: 'en' | 'hi';
}

// Articles API service
export const articlesApi = {
    // Get all articles with filters
    getArticles: async (filters?: ArticleFilters): Promise<ApiResponse<Article[]>> => {
        return apiClient.get<Article[]>('/articles', filters);
    },

    // Get single article by ID
    getArticle: async (id: string): Promise<ApiResponse<Article>> => {
        return apiClient.get<Article>(`/articles/${id}`);
    },

    // Get article by slug
    getArticleBySlug: async (slug: string): Promise<ApiResponse<Article>> => {
        return apiClient.get<Article>(`/articles/slug/${slug}`);
    },

    // Get quick reads (short articles)
    getQuickReads: async (limit?: number): Promise<ApiResponse<Article[]>> => {
        return apiClient.get<Article[]>('/articles/quick-reads', { limit });
    },

    // Get breaking news
    getBreakingNews: async (limit?: number): Promise<ApiResponse<Article[]>> => {
        return apiClient.get<Article[]>('/articles/breaking', { limit });
    },

    // Get top stories
    getTopStories: async (limit?: number): Promise<ApiResponse<Article[]>> => {
        return apiClient.get<Article[]>('/articles/top-stories', { limit });
    },

    // Create new article
    createArticle: async (data: CreateArticleData): Promise<ApiResponse<Article>> => {
        return apiClient.post<Article>('/articles', data);
    },

    // Update article
    updateArticle: async (data: UpdateArticleData): Promise<ApiResponse<Article>> => {
        return apiClient.put<Article>(`/articles/${data.id}`, data);
    },

    // Delete article
    deleteArticle: async (id: string): Promise<ApiResponse<void>> => {
        return apiClient.delete<void>(`/articles/${id}`);
    },

    // Generate news from content
    generateNewsFromContent: async (content: string, options?: Record<string, unknown>): Promise<ApiResponse<Article>> => {
        return apiClient.post<Article>('/articles/generate-from-content', { content, ...options });
    },

    // Generate SEO only
    generateSEOOnly: async (articleId: string, content: string): Promise<ApiResponse<Record<string, unknown>>> => {
        return apiClient.post<Record<string, unknown>>('/articles/generate-seo', { articleId, content });
    },

    // Regenerate with feedback
    regenerateWithFeedback: async (articleId: string, feedback: string): Promise<ApiResponse<Article>> => {
        return apiClient.post<Article>('/articles/regenerate-with-feedback', { articleId, feedback });
    },

    // Translate content
    translateContent: async (articleId: string, targetLanguage: string): Promise<ApiResponse<Article>> => {
        return apiClient.post<Article>(`/articles/${articleId}/translate`, { targetLanguage });
    },
};
