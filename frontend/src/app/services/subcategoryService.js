import api from './api';

export const subcategoryService = {
    fetchAll: async () => {
        const response = await api.get('/api/subcategories');
        return response.data;
    },
    fetchById: async (id) => {
        const response = await api.get(`/api/subcategories/${id}`);
        return response.data;
    },
    create: async (categoryData) => {
        const response = await api.post('/api/subcategories', categoryData);
        return response.data;
    },
    update: async (id, categoryData) => {
        const response = await api.put(`/api/subcategories/${id}`, categoryData);
        return response.data;
    },
    delete: async (id) => {
        await api.delete(`/api/subcategories/${id}`);
    }
};
