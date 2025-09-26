import api from './api';

export const categoryService = {
    fetchAll: async () => {
        const response = await api.get('/api/categories');
        return response.data;
    },
    fetchById: async (id) => {
        const response = await api.get(`/api/categories/${id}`);
        return response.data;
    },
    create: async (categoryData) => {
        const response = await api.post('/api/categories', categoryData);
        return response.data;
    },
    update: async (id, categoryData) => {
        const response = await api.put(`/api/categories/${id}`, categoryData);
        return response.data;
    },
    delete: async (id) => {
        await api.delete(`/api/categories/${id}`);
    }
};
